// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-82853.firebaseapp.com",
  projectId: "mern-estate-82853",
  storageBucket: "mern-estate-82853.appspot.com",
  messagingSenderId: "191907282684",
  appId: "1:191907282684:web:aeba9e634d138b328de179",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
