import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1_c42-Xgv548PGfJBVz3gEuc8_mYnnvs",
  authDomain: "my-interview-app-f79f0.firebaseapp.com",
  projectId: "my-interview-app-f79f0",
  storageBucket: "my-interview-app-f79f0.appspot.com",
  messagingSenderId: "580990086397",
  appId: "1:580990086397:web:e4c596926a1d3f55842294",
  measurementId: "G-SHJ48HBZHN",
};

// ✅ Correctly check getApps().length
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
