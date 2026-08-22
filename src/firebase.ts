import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDemo-ReplaceWithYourFirebaseAPIKey",
  authDomain: "unihack-demo.firebaseapp.com",
  projectId: "unihack-demo",
  storageBucket: "unihack-demo.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
export type { User };
