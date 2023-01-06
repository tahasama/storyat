// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId:  process.env.REACT_APP_MESUREMENT
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const googleProvider = new GoogleAuthProvider();
export const faceBookProvider = new FacebookAuthProvider();

export const auth = getAuth(app);

export const storage = getStorage();

export default app;
