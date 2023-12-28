// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWZt4fDzH9CdAwiMnYUJTpnyBQHwlgpQM",
  authDomain: "instagram-clone-566f8.firebaseapp.com",
  projectId: "instagram-clone-566f8",
  storageBucket: "instagram-clone-566f8.appspot.com",
  messagingSenderId: "700695127867",
  appId: "1:700695127867:web:e80f9040712b60d467f91e",
  measurementId: "G-8J9EP0XQ6X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// no use now ... const analytics = getAnalytics(app);
console.log("firebase success", app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export {
  auth,
  provider,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  db,
};
