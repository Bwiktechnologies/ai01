const { auth: adminAuth } = require('./firebase-admin');

async function resetUserPassword() {
  const email = 'sharma.dhruv@mca.christuniversity.in';
  const newPassword = 'Password@123';

  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    console.log('User found! Updating password...');
    
    await adminAuth.updateUser(userRecord.uid, { password: newPassword });
    console.log('Password successfully updated to:', newPassword);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('This email is not registered in Firebase Authentication.');
    } else {
      console.error('Error updating password:', error.message);
    }
  }
}

resetUserPassword();
