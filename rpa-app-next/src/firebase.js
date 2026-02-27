import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Find these details in your Firebase console Project settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyCAFaYW0VD1A7oFppcbyy8mP6CQyx3QUV8",
    authDomain: "rpa-stealth-audit-723.firebaseapp.com",
    projectId: "rpa-stealth-audit-723",
    storageBucket: "rpa-stealth-audit-723.firebasestorage.app",
    messagingSenderId: "466589356081",
    appId: "1:466589356081:web:2ba06f00eae5104eea8510"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'wugi0525@gmail.com';

export { auth, db, googleProvider, signInWithPopup, signOut };
