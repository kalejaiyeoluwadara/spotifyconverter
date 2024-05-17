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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBpmJjYRkvDf5Th_kof51Weuc48N_cv1D8",
    authDomain: "blogproject-d7ea9.firebaseapp.com",
    projectId: "blogproject-d7ea9",
    storageBucket: "blogproject-d7ea9.appspot.com",
    messagingSenderId: "922380199618",
    appId: "1:922380199618:web:f7ea0f35da34370bc83d5b",
    measurementId: "G-LR27G4ZE0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore and assign it to db

export {
    app,
    analytics,
    db
};