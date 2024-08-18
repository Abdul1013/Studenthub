// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwDlDSwoQgZys7zURFDMFC_b0vS0DcvOs",
  authDomain: "studenthub-44b24.firebaseapp.com",
  projectId: "studenthub-44b24",
  storageBucket: "studenthub-44b24.appspot.com",
  messagingSenderId: "678189316477",
  appId: "1:678189316477:web:de2c3c0ce057c21bdc7414",
  measurementId: "G-PETXQP0V3R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") { // Check if we're in a browser environment
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}

export { analytics }; // Only export analytics if it's initialized
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
