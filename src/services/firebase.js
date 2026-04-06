import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getAdditionalUserInfo
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/**
 * GOOGLE LOGIN
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore, if not create them with 0 points
    await createUserProfile(user);
    return user;
  } catch (error) {
    console.error("Google Auth Error:", error);
    throw error;
  }
};

/**
 * GOOGLE POPUP ONLY (returns isNewUser flag)
 */
export const googlePopupSignIn = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const info = getAdditionalUserInfo(result);
  return { user: result.user, isNewUser: info.isNewUser };
};

/**
 * EMAIL SIGN UP
 */
export const signUpEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Create profile with display name and signup bonus points
    await createUserProfile(user, displayName, 100);
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * EMAIL LOGIN
 */
export const loginEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

/**
 * LOGOUT
 */
export const logout = () => signOut(auth);

/**
 * FIRESTORE: USER PROFILE & POINTS
 */
export const createUserProfile = async (user, displayName = "", initialPoints = 100) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Initial data for new users
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || "Eco Guardian",
      points: initialPoints,
      createdAt: new Date().toISOString(),
      impactHistory: []
    });
  }
};

/**
 * POINT SYSTEM: ADD POINTS
 */
export const addPoints = async (userId, pointsToAdd) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    points: increment(pointsToAdd)
  });
};


/**
 * GET USER DATA (POINTS, ETC)
 */
export const getUserStats = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

/**
 * WASTE MAPPING: PIN WASTE
 */
export const addWastePin = async (pinData) => {
  try {
    const pinsRef = collection(db, "waste_pins");
    const docRef = await addDoc(pinsRef, {
      ...pinData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding pin:", error);
    throw error;
  }
};

/**
 * WASTE MAPPING: GET ALL PINS
 */
export const getWastePins = async () => {
  try {
    const pinsRef = collection(db, "waste_pins");
    const q = query(pinsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting pins:", error);
    return [];
  }
};
