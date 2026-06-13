const adminAuth = require('./firebase-admin').auth;
const db = require('./firebase-admin').db;

async function testCreate() {
  try {
    const userRecord = await adminAuth.createUser({
      email: `test${Date.now()}@test.com`,
      password: 'Password123!',
      displayName: 'Test User'
    });
    console.log('Successfully created user:', userRecord.uid);
  } catch (error) {
    console.error('Auth Error:', error.message);
  }
}

testCreate();
