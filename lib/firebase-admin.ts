// Only import and initialize on server side
let adminDb: any = null;

if (typeof window === 'undefined') {
  try {
    const { initializeApp, getApps, cert } = require('firebase-admin/app');
    const { getFirestore } = require('firebase-admin/firestore');

    // Check if we have the required environment variables
    const hasValidConfig = process.env.FIREBASE_PROJECT_ID && 
                          process.env.FIREBASE_CLIENT_EMAIL && 
                          process.env.FIREBASE_PRIVATE_KEY;

    if (hasValidConfig && !getApps().length) {
      // More robust private key processing
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // Handle different private key formats
      if (privateKey) {
        // Replace \\n with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
        
        // Ensure the key starts and ends correctly
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
          console.error('Private key does not contain proper BEGIN marker');
        }
        if (!privateKey.includes('-----END PRIVATE KEY-----')) {
          console.error('Private key does not contain proper END marker');
        }
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    }

    if (hasValidConfig) {
      adminDb = getFirestore();
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('Firebase Admin configuration is incomplete. Please check your environment variables.');
      console.warn('Missing:', {
        projectId: !process.env.FIREBASE_PROJECT_ID,
        clientEmail: !process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: !process.env.FIREBASE_PRIVATE_KEY,
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('Invalid PEM formatted message')) {
        console.error('PRIVATE KEY FORMAT ERROR: Please ensure your FIREBASE_PRIVATE_KEY in .env.local has \\\\n instead of actual newlines');
        console.error('Example format: "-----BEGIN PRIVATE KEY-----\\\\nYOUR_KEY_CONTENT\\\\n-----END PRIVATE KEY-----\\\\n"');
      }
    }
  }
}

export { adminDb };