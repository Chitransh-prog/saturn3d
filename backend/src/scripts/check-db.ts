import db from '../config/db.js';

async function checkDb() {
  console.log('--- Checking Saturn3D SQLite Database ---');
  const { data: users, error: userError } = await db.from('users').select('*');
  if (userError) {
    console.error('❌ User table error:', userError);
  } else {
    console.log(`✅ Users table verified (${users?.length || 0} users)`);
  }

  const { data: products, error: prodError } = await db.from('products').select('*');
  if (prodError) {
    console.error('❌ Products table error:', prodError);
  } else {
    console.log(`✅ Products table verified (${products?.length || 0} products)`);
  }

  const { data: orders, error: orderError } = await db.from('orders').select('*');
  if (orderError) {
    console.error('❌ Orders table error:', orderError);
  } else {
    console.log(`✅ Orders table verified (${orders?.length || 0} orders)`);
  }
}

checkDb();
