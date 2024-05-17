// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getAnalytics
} from "firebase/analytics";
import {
    getFirestore
} from "firebase/firestore";
import {
    getAuth
} from "firebase/auth"; // Import getAuth from firebase/auth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDEmTTY2neJdt5GT6Y378zryQAo_j7EDvQ",
    authDomain: "deft-clarity-423522-q6.firebaseapp.com",
    projectId: "deft-clarity-423522-q6",
    storageBucket: "deft-clarity-423522-q6.appspot.com",
    messagingSenderId: "587491759521",
    appId: "1:587491759521:web:bca5d4fcbace1de445e7e0",
    measurementId: "G-GJXXWKMJX8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore and assign it to db
const auth = getAuth(app); // Initialize Firebase Authentication and assign it to auth

export {
    app,
    analytics,
    db,
    auth // Export auth
};
