import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3dB36ulPWZayKrgEBafBgI_HBINGjYWU",
  authDomain: "bazinga-fb46b.firebaseapp.com",
  projectId: "bazinga-fb46b",
  storageBucket: "bazinga-fb46b.firebasestorage.app",
  messagingSenderId: "1031632979859",
  appId: "1:1031632979859:web:56a34fa419ad0e47930a66",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
