import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDyr8hAIC5ztDUb78wEiO5ySoyY9gqAIKw",
  authDomain: "neon-lock-296416.firebaseapp.com",
  projectId: "neon-lock-296416",
  storageBucket: "neon-lock-296416.appspot.com",
  messagingSenderId: "581414121529",
  appId: "1:581414121529:web:781cd707af8e819b595de8",
  measurementId: "G-2X1R03L5TK"
});

export const db = getFirestore();