// Only import and initialize on server side
let adminDb: any = null;

if (typeof window === 'undefined') {
  try {
    const { initializeApp, getApps, cert } = require('firebase-admin/app');
    const { getFirestore } = require('firebase-admin/firestore');

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    adminDb = getFirestore();
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export { adminDb };

export { adminDb }