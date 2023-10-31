// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-state-df16e.firebaseapp.com",
  projectId: "e-state-df16e",
  storageBucket: "e-state-df16e.appspot.com",
  messagingSenderId: "1022647290375",
  appId: "1:1022647290375:web:7e92b4cb61cfe79836b8a2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);