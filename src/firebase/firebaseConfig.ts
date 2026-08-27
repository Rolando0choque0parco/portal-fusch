import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC93Xl8uLaQpqoyy4bZLUn8dNUoxaeTYU0",
  authDomain: "fusch-nuevo.firebaseapp.com",
  projectId: "fusch-nuevo",
  storageBucket: "fusch-nuevo.firebasestorage.app",
  messagingSenderId: "561787292675",
  appId: "1:561787292675:web:3ebcb0550e2dc2f15dd236"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);