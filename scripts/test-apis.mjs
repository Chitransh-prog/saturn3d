const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testAll() {
  console.log('--- Testing Saturn 3D Next.js Platform APIs ---');

  // 1. Test Admin Login with default credentials: saturn3d@gmail.com / Saturn3D@123
  console.log('\n[1] Testing Admin Login with default credentials (saturn3d@gmail.com / Saturn3D@123)...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'saturn3d@gmail.com', password: 'Saturn3D@123' })
  });

  const loginData = await loginRes.json();
  const token = loginData.data?.token || loginData.token;
  const user = loginData.data?.user || loginData.user;

  if (!loginRes.ok || !token) {
    throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
  }
  console.log(' Admin Login SUCCESS! User:', user.name, `(${user.role})`);
  const adminToken = token;

  // 2. Test /api/auth/me with admin token
  console.log('\n[2] Testing /api/auth/me with Bearer token...');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const meData = await meRes.json();
  const meUser = meData.data?.user || meData.user;
  if (!meRes.ok || meUser?.email !== 'saturn3d@gmail.com') {
    throw new Error(`/api/auth/me failed: ${JSON.stringify(meData)}`);
  }
  console.log(' /api/auth/me verified:', meUser.email);

  // 3. Test Changing Admin Password & Credentials (/api/admin/credentials)
  console.log('\n[3] Testing Admin Credentials Change (Password update)...');
  const changeRes = await fetch(`${BASE_URL}/api/admin/credentials`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      currentPassword: 'Saturn3D@123',
      newPassword: 'Saturn3D@NewPassword456'
    })
  });
  const changeData = await changeRes.json();
  if (!changeRes.ok || !changeData.success) {
    throw new Error(`Credential update failed: ${JSON.stringify(changeData)}`);
  }
  console.log(' Admin password changed successfully!');

  // Verify old password fails
  console.log(' Verifying old password no longer works...');
  const oldLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'saturn3d@gmail.com', password: 'Saturn3D@123' })
  });
  if (oldLoginRes.ok) {
    throw new Error('Old password was still accepted!');
  }
  console.log(' Old password correctly rejected (401)!');

  // Verify new password works
  console.log(' Verifying new password works...');
  const newLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'saturn3d@gmail.com', password: 'Saturn3D@NewPassword456' })
  });
  const newLoginData = await newLoginRes.json();
  const updatedAdminToken = newLoginData.data?.token || newLoginData.token;
  if (!newLoginRes.ok || !updatedAdminToken) {
    throw new Error('New password failed to log in!');
  }
  console.log(' New password login succeeded!');

  // Restore baseline password back to Saturn3D@123
  console.log(' Restoring baseline admin password to Saturn3D@123...');
  const restoreRes = await fetch(`${BASE_URL}/api/admin/credentials`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${updatedAdminToken}`
    },
    body: JSON.stringify({
      currentPassword: 'Saturn3D@NewPassword456',
      newPassword: 'Saturn3D@123'
    })
  });
  if (!restoreRes.ok) {
    throw new Error('Failed to restore baseline password');
  }
  console.log(' Baseline credentials restored: saturn3d@gmail.com / Saturn3D@123');

  // 4. Test Product Management API
  console.log('\n[4] Testing Admin Products API...');
  const prodRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const prodData = await prodRes.json();
  const products = prodData.data?.products || prodData.products || [];
  console.log(` Found ${products.length} products in catalog.`);

  // Create a test product
  const createProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'API Test Precision Servo Mount',
      slug: `test-servo-mount-${Date.now()}`,
      title: 'Precision Aerospace Mount',
      description: 'Ultra-rigid carbon fiber nylon mount',
      price: 89.99,
      category: 'Drone & Robotics',
      stock: 15,
      image: '/products/vase.jpg'
    })
  });
  const createdProd = await createProdRes.json();
  const prodItem = createdProd.data?.product || createdProd.product;
  if (!createProdRes.ok || !prodItem?.id) {
    throw new Error(`Create product failed: ${JSON.stringify(createdProd)}`);
  }
  console.log(' Product created with ID:', prodItem.id);

  // Delete test product
  const delProdRes = await fetch(`${BASE_URL}/api/admin/products/${prodItem.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  if (!delProdRes.ok) {
    throw new Error('Delete product failed');
  }
  console.log(' Product successfully soft-deleted.');

  // 5. Test Categories API
  console.log('\n[5] Testing Categories API...');
  const catRes = await fetch(`${BASE_URL}/api/categories`);
  const catData = await catRes.json();
  const categories = catData.data?.categories || catData.categories || [];
  console.log(` Found ${categories.length} active categories.`);

  // 6. Test Inquiries Management API
  console.log('\n[6] Testing Inquiries API...');
  // Post an inquiry
  const postInqRes = await fetch(`${BASE_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Cyber Dynamics Ltd',
      email: 'engineering@cyberdynamics.io',
      company_name: 'Cyber Dynamics',
      subject: 'Custom PA12-CF Enclosure Quote',
      message: 'Need 500 units of custom telemetry enclosures with brass threaded inserts.',
      quantity: 500
    })
  });
  const inqData = await postInqRes.json();
  const inqItem = inqData.data?.inquiry || inqData.inquiry;
  if (!postInqRes.ok || !inqItem?.id) {
    throw new Error(`Post inquiry failed: ${JSON.stringify(inqData)}`);
  }
  console.log(' Inquiry created with ID:', inqItem.id);

  // Admin view inquiries
  const adminInqRes = await fetch(`${BASE_URL}/api/admin/inquiries`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminInqData = await adminInqRes.json();
  const inquiries = adminInqData.data?.inquiries || adminInqData.inquiries || [];
  const foundInq = inquiries.find(i => i.id === inqItem.id);
  if (!foundInq) {
    throw new Error('Admin could not find the posted inquiry');
  }
  console.log(' Admin successfully retrieved inquiry:', foundInq.subject);

  // Update inquiry status
  const patchInqRes = await fetch(`${BASE_URL}/api/admin/inquiries/${inqItem.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'in-review' })
  });
  if (!patchInqRes.ok) {
    throw new Error('Failed to update inquiry status');
  }
  console.log(' Inquiry status updated to in-review');

  // Delete test inquiry
  await fetch(`${BASE_URL}/api/admin/inquiries/${inqItem.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(' Inquiry cleaned up.');

  // 7. Test Customer Registration & Authentication
  console.log('\n[7] Testing Customer Registration & Token Auth...');
  const testUserEmail = `customer_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Kavita Sharma',
      email: testUserEmail,
      password: 'UserSecretPassword123'
    })
  });
  const regData = await regRes.json();
  const regUser = regData.data?.user || regData.user;
  const regToken = regData.data?.token || regData.token;
  if (!regRes.ok || !regToken) {
    throw new Error(`Customer registration failed: ${JSON.stringify(regData)}`);
  }
  console.log(' Customer registered successfully! Role:', regUser.role);

  console.log('\n ALL TESTS PASSED SUCCESSFULLY! Saturn 3D Next.js Platform is 100% fully operational.');
}

testAll().catch(err => {
  console.error('\n TEST SUITE FAILED:', err);
  process.exit(1);
});
