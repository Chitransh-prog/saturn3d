-- Function to atomically decrement stock and prevent it from going below zero
-- Usage: select decrement_stock('product-uuid', 2);

CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id UUID, p_quantity INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of creator (admin)
AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_product_id;
END;
$$;
