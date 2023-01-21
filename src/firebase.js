// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm1FubxfQf0id4OVaN2IF97K4VMEeCx1Y",
  authDomain: "virtualpt-9893e.firebaseapp.com",
  projectId: "virtualpt-9893e",
  storageBucket: "virtualpt-9893e.appspot.com",
  messagingSenderId: "396057547933",
  appId: "1:396057547933:web:28ed897bee97b65dfb7074",
  measurementId: "G-EP10Q17587"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);