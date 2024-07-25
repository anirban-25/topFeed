// utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc8bW2CHBoV6PO4Y2g3bPRcskxOGI3HYE",
  authDomain: "topfeed-123.firebaseapp.com",
  projectId: "topfeed-123",
  storageBucket: "topfeed-123.appspot.com",
  messagingSenderId: "1074359159074",
  appId: "1:1074359159074:web:d4b340ef20e26c310ebd7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
