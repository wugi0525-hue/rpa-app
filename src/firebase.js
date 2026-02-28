import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Find these details in your Firebase console Project settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyB6LM-QYeyWoHrXjVsXWYcMWCmTNSwI3cc",
    authDomain: "rpa-app-v2-0525.firebaseapp.com",
    projectId: "rpa-app-v2-0525",
    storageBucket: "rpa-app-v2-0525.firebasestorage.app",
    messagingSenderId: "755016969205",
    appId: "1:755016969205:web:b8bf8a017c7be8045a4ebc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'wugi0525@gmail.com';

export { auth, db, googleProvider, signInWithPopup, signOut };
