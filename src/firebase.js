// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnRYvYkkQ_DErQ_15B4-Gk7xQ6zHXq_mo",
  authDomain: "jodo-e393c.firebaseapp.com",
  databaseURL: "https://jodo-e393c-default-rtdb.firebaseio.com",
  projectId: "jodo-e393c",
  storageBucket: "jodo-e393c.appspot.com",
  messagingSenderId: "650082399356",
  appId: "1:650082399356:web:6248d9dd86cfe7fd0fc5f9",
  measurementId: "G-Z2LMNPEZ3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
