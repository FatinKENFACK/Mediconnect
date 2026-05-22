import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase (remplacez par vos propres identifiants)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Cette fonction sera utilisée pour initialiser Firebase dans votre application
// Vous pouvez l'importer dans votre fichier index.js ou App.js
// Exemple d'utilisation :
// import { initializeFirebase } from './services/firebase';
// initializeFirebase();
