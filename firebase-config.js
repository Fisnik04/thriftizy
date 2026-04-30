const firebaseConfig = {
  apiKey: "AIzaSyDk_COfCsWJxjClzToi7e7PxT7lW9rhbRU",
  authDomain: "thriftizy-app.firebaseapp.com",
  projectId: "thriftizy-app",
  storageBucket: "thriftizy-app.firebasestorage.app",
  messagingSenderId: "543270915368",
  appId: "1:543270915368:web:e158e7b405edcf8108941d",
  measurementId: "G-YSYHGE6XZX"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, getDoc, updateDoc, deleteDoc, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, addDoc, getDocs, query, where, doc, setDoc, getDoc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL, orderBy, onSnapshot, serverTimestamp };
