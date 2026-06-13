const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// Note: Ensure the FIREBASE_PRIVATE_KEY is formatted correctly in the .env file.
// It should contain actual newlines or \n characters that are replaced here.
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
