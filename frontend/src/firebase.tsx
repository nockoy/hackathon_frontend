import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

/*
const firebaseConfig = {
  apiKey: "AIzaSyAytWm2b7E_9dUayK0TH3Muf0DWwujw2BY",
  authDomain: "term3-shun-kondo.firebaseapp.com",
  projectId: "term3-shun-kondo",
  storageBucket: "term3-shun-kondo.appspot.com",
  messagingSenderId: "612377943444",
  appId: "1:612377943444:web:66c59d3a709116c6414381",
  measurementId: "G-BM8GDN7KR1"
};
*/

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const fireAuth = getAuth(app);