import { Response } from 'express';
import { AuthRequest, CartItem } from '../types/index.js';
import supabase from '../config/supabase.js';
import stripe from '../config/stripe.js';
import { getPaymentProvider } from '../services/payment/index.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Helper to decrement stock transactionally
async function decrementProductStock(orderId: string, items: { productId: string; quantity: number }[]) {
  for (const item of items) {
    if (item.productId) {
      const { error: rpcError } = await supabase.rpc('decrement_stock', {
        p_product_id: item.productId,
        p_quantity: item.quantity,
      });

      if (rpcError) {
        const { data: prod } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single();

        if (prod) {
          await supabase
            .from('products')
            .update({ stock: Math.max(0, prod.stock - item.quantity) })
            .eq('id', item.productId);
        }
      }
    }
  }
}

// POST /api/orders/checkout — creates order with Razorpay, COD, or Stripe
export const createCheckout = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { items, shippingAddress, paymentMethod = 'razorpay', couponCode } = req.body as {
      items: CartItem[];
      paymentMethod?: 'razorpay' | 'cod' | 'stripe';
      couponCode?: string;
      shippingAddress?: {
        line1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
      };
    };

    console.log('[Orders] Checkout request. Method:', paymentMethod, 'Auth User:', req.user?.userId);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // 1. Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const invalidFormatIds = items
      .map(item => item.productId)
      .filter(id => !id || !uuidRegex.test(id));

    if (invalidFormatIds.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Outdated items detected: ${invalidFormatIds.join(', ')}. Please clear your cart.`,
        action: 'CLEAR_CART_REQUIRED',
        invalidIds: invalidFormatIds,
      });
    }

    // 2. Fetch products from DB
    const productIds = items.map((item: any) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image, stock, description')
      .in('id', productIds)
      .eq('is_active', true);

    if (productsError || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid products found in your cart. Please clear your cart and try again.',
      });
    }

    // Check stock & compute subtotal
    let subtotal = 0;
    for (const cartItem of items) {
      const product = (products as any[]).find((p: any) => p.id === cartItem.productId);
      if (!product) {
        return res.status(400).json({ success: false, error: `Product not found: ${cartItem.productId}` });
      }
      const currentStock = product.stock ?? 0;
      if (currentStock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${product.name}". Available: ${currentStock}`,
        });
      }
      subtotal += product.price * cartItem.quantity;
    }

    // 3. Server-side coupon calculation
    let discountAmount = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .single();

      if (coupon) {
        const now = new Date();
        const validDates = (!coupon.start_date || new Date(coupon.start_date) <= now) &&
                           (!coupon.end_date || new Date(coupon.end_date) >= now);
        const validMinOrder = !coupon.min_order_value || subtotal >= coupon.min_order_value;

        if (validDates && validMinOrder) {
          if (coupon.type === 'percent') {
            discountAmount = (subtotal * coupon.value) / 100;
            if (coupon.max_discount_cap && discountAmount > coupon.max_discount_cap) {
              discountAmount = coupon.max_discount_cap;
            }
          } else {
            discountAmount = Math.min(coupon.value, subtotal);
          }
          appliedCoupon = coupon;
        }
      } else if (cleanCode === 'PRECISION10' || cleanCode === 'SATURN20') {
        const percent = cleanCode === 'SATURN20' ? 20 : 10;
        discountAmount = (subtotal * percent) / 100;
      }
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const netSubtotal = Math.max(0, subtotal - discountAmount);
    // 18% GST calculation (Standard India 3D printing manufacturing rate)
    const taxAmount = Math.round(netSubtotal * 0.18 * 100) / 100;
    // Free shipping above ₹1500 / $50
    const shippingAmount = netSubtotal >= 1500 || netSubtotal >= 50 ? 0 : 150;
    const grandTotal = Math.round((netSubtotal + taxAmount + shippingAmount) * 100) / 100;

    // 4. Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user!.userId,
        total_amount: grandTotal,
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        coupon_code: appliedCoupon?.code || couponCode || null,
        status: 'pending',
        payment_method: paymentMethod,
        shipping_address: shippingAddress || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('[Orders] Database error creating order:', orderError);
      return res.status(500).json({ success: false, error: 'Failed to create order record' });
    }

    // Insert order items
    const orderItems = items.map((cartItem) => {
      const product = (products as any[]).find((p: any) => p.id === cartItem.productId)!;
      return {
        order_id: order.id,
        product_id: cartItem.productId,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      };
    });

    await supabase.from('order_items').insert(orderItems);

    const orderNumber = `SATURN-${order.id.slice(0, 8).toUpperCase()}`;

    // ── RAZORPAY PAYMENT FLOW (Standard India) ───────────────────────
    if (paymentMethod === 'razorpay') {
      const provider = getPaymentProvider('razorpay');
      const session = await provider.createPaymentSession({
        orderId: order.id,
        orderNumber,
        amount: grandTotal,
        currency: 'INR',
        customer: {
          name: req.user?.email?.split('@')[0] || 'Customer',
          email: req.user?.email || '',
        },
      });

      await supabase
        .from('orders')
        .update({
          payment_provider: 'razorpay',
          razorpay_order_id: session.paymentSessionId,
        })
        .eq('id', order.id);

      return res.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber,
          paymentMethod: 'razorpay',
          razorpayOrderId: session.paymentSessionId,
          keyId: session.keyId,
          amount: grandTotal,
          currency: 'INR',
          subtotal,
          discountAmount,
          taxAmount,
          shippingAmount,
          checkoutUrl: `${FRONTEND_URL}/order-success?order_id=${order.id}&method=razorpay`,
        },
      });
    }

    // ── CASH ON DELIVERY (COD) FLOW ─────────────────────────────────
    if (paymentMethod === 'cod') {
      const provider = getPaymentProvider('cod');
      const session = await provider.createPaymentSession({
        orderId: order.id,
        orderNumber,
        amount: grandTotal,
        customer: {
          name: req.user?.email?.split('@')[0] || 'Customer',
          email: req.user?.email || '',
        },
      });

      await supabase
        .from('orders')
        .update({
          payment_provider: 'cod',
          payment_status: 'cod_pending',
          status: 'pending',
        })
        .eq('id', order.id);

      return res.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber,
          paymentMethod: 'cod',
          isCod: true,
          amount: grandTotal,
          currency: 'INR',
          subtotal,
          discountAmount,
          taxAmount,
          shippingAmount,
          checkoutUrl: `${FRONTEND_URL}/order-success?order_id=${order.id}&method=cod`,
        },
      });
    }

    // ── STRIPE FLOW (Fallback) ──────────────────────────────────────
    const stripeKey = process.env.STRIPE_SECRET_KEY || '';
    const isSimulated = !stripeKey || stripeKey.includes('placeholder') || stripeKey === '';

    let checkoutUrl = '';
    let sessionId = 'simulated';

    if (isSimulated) {
      sessionId = `simulated_${order.id}`;
      checkoutUrl = `${FRONTEND_URL}/order-success?order_id=${order.id}&session_id=${sessionId}&simulated=true`;
      await supabase.from('orders').update({ status: 'paid', stripe_session_id: sessionId }).eq('id', order.id);
    } else {
      const lineItems = items.map((cartItem) => {
        const product = (products as any[]).find((p: any) => p.id === cartItem.productId)!;
        return {
          price_data: {
            currency: 'usd',
            product_data: { name: product.name, images: product.image?.startsWith('http') ? [product.image] : [] },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: cartItem.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${FRONTEND_URL}/checkout`,
        customer_email: req.user!.email,
      });

      await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);
      checkoutUrl = session.url!;
      sessionId = session.id;
    }

    res.json({
      success: true,
      data: {
        checkoutUrl,
        sessionId,
        orderId: order.id,
        isSimulated,
      },
    });
  } catch (err: any) {
    console.error('[Orders] Checkout exception:', err);
    res.status(500).json({ success: false, error: err.message || 'Checkout failed' });
  }
};

// GET /api/orders — get user's orders
export const getUserOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', req.user!.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Orders] GetUserOrders error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch orders' });
      return;
    }

    res.json({ success: true, data: { orders: orders || [] } });
  } catch (err) {
    console.error('[Orders] GetUserOrders error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/orders/:id — get specific order
export const getOrderById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id);

    // Non-admins can only see their own orders
    if (req.user?.role !== 'admin') {
      query.eq('user_id', req.user!.userId);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.json({ success: true, data: { order } });
  } catch (err) {
    console.error('[Orders] GetById error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/orders/webhook — Stripe webhook
export const stripeWebhook = async (req: AuthRequest, res: Response): Promise<any> => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: import('stripe').Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } else {
      // Development: parse body directly
      event = JSON.parse((req.body as Buffer).toString()) as import('stripe').Stripe.Event;
    }
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    res.status(400).json({ error: 'Webhook signature verification failed' });
    return;
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as import('stripe').Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        // Fetch current order status to prevent double processing
        const { data: currentOrder } = await supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .single();

        if (currentOrder && currentOrder.status === 'pending') {
          // Update order to paid
          await supabase
            .from('orders')
            .update({
              status: 'paid',
              stripe_payment_intent: session.payment_intent as string,
            })
            .eq('id', orderId);

          // Decrement stock for each item
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('product_id, quantity')
            .eq('order_id', orderId);

          if (orderItems) {
            for (const item of orderItems) {
              if (item.product_id) {
                // Try RPC first for atomic decrement
                const { error: rpcError } = await supabase.rpc('decrement_stock', {
                  p_product_id: item.product_id,
                  p_quantity: item.quantity,
                });

                // If RPC fails (e.g. doesn't exist), fallback to manual update
                if (rpcError) {
                  const { data: prod } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.product_id)
                    .single();
                    
                  if (prod) {
                    await supabase
                      .from('products')
                      .update({ stock: Math.max(0, prod.stock - item.quantity) })
                      .eq('id', item.product_id);
                  }
                }
              }
            }
          }
          console.log(`[Webhook] Order ${orderId} marked as PAID and stock decremented`);
        } else {
          console.log(`[Webhook] Order ${orderId} already processed (status: ${currentOrder?.status})`);
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as import('stripe').Stripe.PaymentIntent;

      // Find order by payment intent and mark as cancelled
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('stripe_payment_intent', pi.id);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// GET /api/orders/verify-session/:sessionId — verify payment and return order
export const verifyStripeSession = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({ success: false, error: 'Session ID is required' });
      return;
    }

    let session: any = null;
    const isSimulatedSession = (sessionId as string).startsWith('simulated_');

    if (isSimulatedSession) {
      session = { payment_status: 'paid', payment_intent: 'pi_simulated_' + sessionId };
    } else {
      // 1. Retrieve the session from Stripe
      session = await stripe.checkout.sessions.retrieve(sessionId as string);
    }

    if (!session) {
      res.status(404).json({ success: false, error: 'Stripe session not found' });
      return;
    }

    // 2. Find the order by stripe_session_id
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('stripe_session_id', sessionId as string)
      .single();

    if (orderError || !order) {
      res.status(404).json({ success: false, error: 'Order not found for this session' });
      return;
    }

    // 3. Security Check: Ensure the order belongs to the current user
    if (order.user_id !== req.user?.userId && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }

    // 4. If Stripe says it's paid but our DB says pending, sync it
    // This handles the case where the frontend success page loads before the webhook
    if (session.payment_status === 'paid' && order.status === 'pending') {
      console.log('[Orders] Syncing order status from Stripe session (Success page fallback)');
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_payment_intent: session.payment_intent as string,
        })
        .eq('id', order.id);
      
      // Update local object for response
      order.status = 'paid';

      // Also decrement stock here since we are marking it as paid
      if (order.order_items) {
        for (const item of order.order_items) {
          if (item.product_id) {
            const { error: rpcError } = await supabase.rpc('decrement_stock', {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            });

            if (rpcError) {
              const { data: prod } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.product_id)
                .single();
                
              if (prod) {
                await supabase
                  .from('products')
                  .update({ stock: Math.max(0, prod.stock - item.quantity) })
                  .eq('id', item.product_id);
              }
            }
          }
        }
      }
    }

    res.json({ success: true, data: { order } });
  } catch (err) {
    console.error('[Orders] VerifySession error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/orders/verify-razorpay — HMAC signature check & payment completion
export const verifyRazorpayPayment = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing payment parameters' });
    }

    const provider = getPaymentProvider('razorpay');
    const verification = await provider.verifyPayment({
      orderId,
      razorpayOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!verification.success) {
      return res.status(400).json({ success: false, error: verification.error || 'Payment verification failed' });
    }

    // Retrieve order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Mark order as paid
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_status: 'paid',
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    // Decrement stock for all items
    if (order.order_items) {
      const itemsToDecrement = order.order_items.map((i: any) => ({
        productId: i.product_id,
        quantity: i.quantity,
      }));
      await decrementProductStock(orderId, itemsToDecrement);
    }

    // Increment coupon times_used if applied
    if (order.coupon_code) {
      try {
        const { data: coupon } = await supabase
          .from('coupons')
          .select('id, times_used')
          .eq('code', order.coupon_code)
          .single();
        if (coupon) {
          await supabase
            .from('coupons')
            .update({ times_used: (coupon.times_used || 0) + 1 })
            .eq('id', coupon.id);
        }
      } catch (cErr) {
        console.warn('[Orders] Coupon usage increment note:', cErr);
      }
    }

    order.status = 'paid';
    res.json({
      success: true,
      message: 'Razorpay payment verified and order marked as paid',
      data: { order },
    });
  } catch (err: any) {
    console.error('[Orders] VerifyRazorpay error:', err);
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
};

// GET /api/orders/:id/invoice — Tax invoice data for PDF & printing
export const getOrderInvoice = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const query = supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey (id, name, email),
        order_items (*)
      `)
      .eq('id', id);

    if (req.user?.role !== 'admin') {
      query.eq('user_id', req.user!.userId);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const subtotal = order.subtotal || order.total_amount;
    const discount = order.discount_amount || 0;
    const net = Math.max(0, subtotal - discount);
    const cgst = Math.round(net * 0.09 * 100) / 100;
    const sgst = Math.round(net * 0.09 * 100) / 100;
    const total = order.total_amount;

    res.json({
      success: true,
      data: {
        invoice: {
          invoiceNumber,
          invoiceDate,
          orderId: order.id,
          orderStatus: order.status,
          paymentMethod: order.payment_method || 'Razorpay / Prepaid',
          paymentStatus: order.status === 'paid' ? 'PAID' : 'PENDING',
          supplier: {
            name: 'Saturn 3D Technologies Pvt. Ltd.',
            address: 'Plot 42, Sector C, Govindpura Industrial Area, Bhopal, MP 462023, India',
            gstin: '23AABCS1234F1Z5',
            email: 'hello@saturn3d.in',
            phone: '+91 79998 24632',
            sacCode: '9988 (Manufacturing Services - 3D Printing)',
          },
          customer: {
            name: order.users?.name || 'Valued Client',
            email: order.users?.email || '',
            shippingAddress: order.shipping_address,
          },
          items: order.order_items || [],
          financials: {
            subtotal,
            discount,
            netTaxableAmount: net,
            cgst,
            sgst,
            totalGst: cgst + sgst,
            shippingCost: order.shipping_amount || 0,
            grandTotal: total,
            currency: 'INR',
          },
        },
      },
    });
  } catch (err: any) {
    console.error('[Orders] GetInvoice error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
