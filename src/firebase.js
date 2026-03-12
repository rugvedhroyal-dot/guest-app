// ─── Firebase configuration and helpers ──────────────────────────────────────
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

// ─── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCvgFMIDnv0kTHd-2ouaP0Fy-v3W6W-A50",
  authDomain: "visitors-dc224.firebaseapp.com",
  projectId: "visitors-dc224",
  storageBucket: "visitors-dc224.appspot.com", // fixed
  messagingSenderId: "570332502887",
  appId: "1:570332502887:web:81cd911e219b3c83de2dc2",
};

// ─── Initialize Firebase ──────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ─── Anonymous Authentication ─────────────────────────────────────────────────
export const signInAnon = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Anonymous sign-in error:", error);
    return null;
  }
};
export { onAuthStateChanged };

// ─── Visitor Counter ──────────────────────────────────────────────────────────
export const incrementVisitor = async () => {
  const ref = doc(db, "analytics", "visitors");
  try {
    await updateDoc(ref, { count: increment(1), lastVisit: serverTimestamp() });
  } catch {
    await setDoc(ref, { count: 1, lastVisit: serverTimestamp() });
  }
};

export const subscribeToVisitorCount = (callback) => {
  const ref = doc(db, "analytics", "visitors");
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data().count : 0);
  });
};

// ─── Chat History ─────────────────────────────────────────────────────────────
export const saveChatMessage = async (sessionId, role, content) => {
  await addDoc(collection(db, "chats"), {
    sessionId,
    role,
    content,
    timestamp: serverTimestamp(),
  });
};

export const loadChatHistory = async (sessionId) => {
  const q = query(
    collection(db, "chats"),
    where("sessionId", "==", sessionId),
    orderBy("timestamp", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Emergency Contacts ───────────────────────────────────────────────────────
export const saveEmergencyContact = async (sessionId, email, name) => {
  await setDoc(doc(db, "emergencyContacts", sessionId), {
    sessionId,
    email,
    name,
    createdAt: serverTimestamp(),
  });
};

export const getEmergencyContact = async (sessionId) => {
  const snap = await getDoc(doc(db, "emergencyContacts", sessionId));
  return snap.exists() ? snap.data() : null;
};

export const logEmergencyTrigger = async (sessionId, triggerPhrase) => {
  await addDoc(collection(db, "emergencyTriggers"), {
    sessionId,
    triggerPhrase,
    timestamp: serverTimestamp(),
  });
};

// ─── Mood Tracker ─────────────────────────────────────────────────────────────
export const saveMoodEntry = async (sessionId, mood, note = "") => {
  await addDoc(collection(db, "moods"), {
    sessionId,
    mood,
    note,
    date: new Date().toISOString().split("T")[0],
    timestamp: serverTimestamp(),
  });
};

export const loadMoodHistory = async (sessionId) => {
  const q = query(
    collection(db, "moods"),
    where("sessionId", "==", sessionId),
    orderBy("timestamp", "desc"),
    limit(30)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse();
};

// ─── Badges ───────────────────────────────────────────────────────────────────
export const saveBadge = async (sessionId, badgeId) => {
  const ref = doc(db, "badges", sessionId);
  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data().earned || [] : [];
  if (!current.includes(badgeId)) {
    await setDoc(ref, { earned: [...current, badgeId], updatedAt: serverTimestamp() });
  }
};

export const loadBadges = async (sessionId) => {
  const snap = await getDoc(doc(db, "badges", sessionId));
  return snap.exists() ? snap.data().earned || [] : [];
};

// ─── Admin Functions ─────────────────────────────────────────────────────────
export const loadRecentChats = async (limitCount = 50) => {
  const q = query(collection(db, "chats"), orderBy("timestamp", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const loadAllMoods = async (limitCount = 100) => {
  const q = query(collection(db, "moods"), orderBy("timestamp", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const loadEmergencyTriggers = async () => {
  const q = query(collection(db, "emergencyTriggers"), orderBy("timestamp", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Exports for generic use ──────────────────────────────────────────────────
export { serverTimestamp, onSnapshot, collection, query, orderBy, limit };