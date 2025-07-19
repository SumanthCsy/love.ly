// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAUUGy9Lr7sPXaforjVzFWzKKt4H7tqCg",
  authDomain: "love0112.firebaseapp.com",
  projectId: "love0112",
  storageBucket: "love0112.firebasestorage.app",
  messagingSenderId: "291192489992",
  appId: "1:291192489992:web:56e861e45acb9c3779a9bd",
  measurementId: "G-4E9M30THQT"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
