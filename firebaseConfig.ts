import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// STAP 1: Vervang onderstaande gegevens met die van jouw Firebase Console
// (Project Settings -> General -> Your apps -> SDK Setup and Configuration)
const firebaseConfig = {
  apiKey: "AIzaSyB32TxbRKNZleoBVYH1t1YIe44JThk2AmY",
  authDomain: "gembawalk-dashboard.firebaseapp.com",
  projectId: "gembawalk-dashboard",
  storageBucket: "gembawalk-dashboard.firebasestorage.app",
  messagingSenderId: "969057485714",
  appId: "1:969057485714:web:35adc28c5fbd56c285374b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);