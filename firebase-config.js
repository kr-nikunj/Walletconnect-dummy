// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiRUC8vXNWgiHpGEVavHCPYLRJJ3VIFlk",
  authDomain: "fir-5f648.firebaseapp.com",
  projectId: "fir-5f648",
  storageBucket: "fir-5f648.appspot.com",
  messagingSenderId: "297474555923",
  appId: "1:297474555923:web:2091e9ae866cb185e03fe6",
  measurementId: "G-M6R8RR6LK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);