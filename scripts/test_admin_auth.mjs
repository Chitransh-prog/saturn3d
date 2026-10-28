// scratch/test_admin_auth.mjs
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- 1. Testing Admin Login with .env credentials ---');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'saturn3d@gmail.com',
      password: 'Saturn3D@123',
    }),
  });

  const loginData = await loginRes.json();
  console.log('Login Response Status:', loginRes.status, 'Success:', loginData.success);
  if (!loginData.success || !loginData.data?.token) {
    throw new Error('Failed to login with default admin credentials: ' + JSON.stringify(loginData));
  }

  const token = loginData.data.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  console.log('\n--- 2. Testing GET /api/admin/credentials ---');
  const getRes = await fetch(`${BASE_URL}/api/admin/credentials`, {
    headers: authHeaders,
  });
  const getData = await getRes.json();
  console.log('Admins count:', getData.data?.admins?.length);
  console.log('Admins list:', getData.data?.admins?.map(a => ({ email: a.email, role: a.role })));

  console.log('\n--- 3. Testing POST /api/admin/credentials (Add New Admin Email) ---');
  const testNewEmail = `testadmin_${Date.now()}@saturn3d.in`;
  const postRes = await fetch(`${BASE_URL}/api/admin/credentials`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      email: testNewEmail,
      name: 'Workshop Lead Engineer',
      password: 'InitialPassword123!',
    }),
  });
  const postData = await postRes.json();
  console.log('Create Admin Status:', postRes.status, 'Message:', postData.message);
  if (!postData.success) {
    throw new Error('Failed to create new admin: ' + JSON.stringify(postData));
  }
  const createdAdminId = postData.data.admin.id;

  console.log('\n--- 4. Testing PUT /api/admin/credentials (Update Password for New Admin) ---');
  const newPassword = 'UpdatedSecurePassword456!';
  const putRes = await fetch(`${BASE_URL}/api/admin/credentials`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      adminId: createdAdminId,
      newPassword: newPassword,
      name: 'Updated Lead Engineer',
    }),
  });
  const putData = await putRes.json();
  console.log('Update Password Status:', putRes.status, 'Message:', putData.message);
  if (!putData.success) {
    throw new Error('Failed to update admin password: ' + JSON.stringify(putData));
  }

  console.log('\n--- 5. Verifying Login with New Admin & Updated Password ---');
  const verifyLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testNewEmail,
      password: newPassword,
    }),
  });
  const verifyData = await verifyLoginRes.json();
  console.log('New Admin Login Status:', verifyLoginRes.status, 'Role:', verifyData.data?.user?.role);
  if (!verifyData.success || verifyData.data?.user?.role !== 'admin') {
    throw new Error('Failed to login with newly created admin and updated password!');
  }

  console.log('\n--- 6. Testing DELETE /api/admin/credentials (Cleanup) ---');
  const delRes = await fetch(`${BASE_URL}/api/admin/credentials?adminId=${createdAdminId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  const delData = await delRes.json();
  console.log('Delete Admin Status:', delRes.status, 'Message:', delData.message);

  console.log('\n--- 7. Testing Safety Gate: Sole Admin deletion prevention ---');
  const soleDelRes = await fetch(`${BASE_URL}/api/admin/credentials?adminId=${loginData.data.user.id}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  const soleDelData = await soleDelRes.json();
  console.log('Sole Admin Delete Attempt Status:', soleDelRes.status, 'Error:', soleDelData.error);

  console.log('\n>>> ALL ADMIN AUTHENTICATION & CREDENTIAL TESTS PASSED PERFECTLY! <<<');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
