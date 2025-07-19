// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { db };
