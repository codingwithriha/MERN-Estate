// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-815ec.firebaseapp.com",
  projectId: "mern-estate-815ec",
  storageBucket: "mern-estate-815ec.firebasestorage.app",
  messagingSenderId: "815597347237",
  appId: "1:815597347237:web:1941023a26856fa3aac84c",
  measurementId: "G-LD41JYYE5G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;