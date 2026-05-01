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

/** Kur mungon fusha `image`, mos përdorni foto lokale — vetëm këtë sfond neutër (jo produkt demo). */
export const FIREBASE_PRODUCT_IMAGE_MISSING_BG = 'linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 100%)';

/**
 * Lista e deri në 3 URL fotosh për një dokument produkti në Firestore.
 * Mbështet: `images` / `photos` (array ose objekt vendesh), më pas `image`/`imageUrl`/`photoUrl`.
 */
export function firebaseProductImageUrls(product) {
  const out = [];

  /** @param {unknown} val */
  function pushTrimmed(val) {
    if (val == null || val === '') return;
    const s = String(val).trim();
    if (!s || out.includes(s)) return;
    out.push(s);
    if (out.length >= 3) return true;
    return false;
  }

  const rawList = product?.images ?? product?.photos;
  if (Array.isArray(rawList)) {
    for (const x of rawList) {
      if (pushTrimmed(x)) break;
    }
  } else if (rawList && typeof rawList === 'object') {
    for (const x of Object.values(rawList)) {
      if (pushTrimmed(x)) break;
    }
  }

  if (out.length < 3) pushTrimmed(product?.image ?? product?.imageUrl ?? product?.photoUrl);

  return out.slice(0, 3);
}

/** Për `<img src>` / lightbox: hiq wrapper-in `url('...')` dhe gradientët. */
export function normalizeProductImageUrlForImg(val) {
  const s = val == null ? '' : String(val).trim();
  if (!s || /^linear-gradient/i.test(s)) return '';
  if (/^url\(/i.test(s)) {
    let inner = s.replace(/^url\(\s*/, '').replace(/\s*\)\s*$/, '').trim();
    if (
      (inner.startsWith('"') && inner.endsWith('"')) ||
      (inner.startsWith("'") && inner.endsWith("'"))
    ) {
      inner = inner.slice(1, -1);
    }
    return inner;
  }
  return s;
}

/** Deri në 3 URL që mund të përdoren në `<img>` ose fullscreen. */
export function firebaseProductImageUrlsForViewer(product) {
  return firebaseProductImageUrls(product)
    .map(normalizeProductImageUrlForImg)
    .filter(Boolean)
    .slice(0, 3);
}

/** Fotoja kryesore (e para), për pajtueshmëri me fushën e njëfishtë `image`. */
export function firebaseProductImageUrl(product) {
  const urls = firebaseProductImageUrls(product);
  return urls[0] || '';
}

/** Për CSS `background-image`: URL nga Firebase, ose gradient kur nuk ka foto. */
export function firebaseProductImageBackgroundCss(product) {
  const u = firebaseProductImageUrl(product);
  if (!u) return FIREBASE_PRODUCT_IMAGE_MISSING_BG;
  if (u.startsWith('url(')) return u;
  const safe = u.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `url('${safe}')`;
}

export { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, addDoc, getDocs, query, where, doc, setDoc, getDoc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL, orderBy, onSnapshot, serverTimestamp };
