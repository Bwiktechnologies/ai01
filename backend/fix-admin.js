const { auth: adminAuth, db } = require('./firebase-admin');

async function fixAdminAccount() {
  const email = 'ashutoshshekhar37@gmail.com';
  const password = 'Ashutosh@1234sa';

  try {
    let userRecord;
    try {
      // Check if user exists
      userRecord = await adminAuth.getUserByEmail(email);
      console.log('User found in Firebase Auth. Updating password...');
      // Update password
      await adminAuth.updateUser(userRecord.uid, { password });
      console.log('Password updated successfully!');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('User not found in Firebase Auth. Creating new admin user...');
        userRecord = await adminAuth.createUser({
          email,
          password,
          displayName: 'Admin Ashutosh'
        });
        console.log('Admin user created successfully!');
      } else {
        throw error;
      }
    }

    // Ensure the user has the 'admin' role in Firestore
    console.log('Ensuring user has admin role in Firestore...');
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name: 'Admin Ashutosh',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('Firestore updated successfully. You can now log in!');
    
  } catch (error) {
    console.error('Error fixing admin account:', error.message);
  }
}

fixAdminAccount();
