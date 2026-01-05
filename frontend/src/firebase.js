import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBVCbDOR1Kg2xfNbatv9fhjPpOYBIaj-U4",
    authDomain: "smartbillingsystem-9b3ad.firebaseapp.com",
    projectId: "smartbillingsystem-9b3ad",
    storageBucket: "smartbillingsystem-9b3ad.firebasestorage.app",
    messagingSenderId: "992762991978",
    appId: "1:992762991978:web:5d97f5cbe733976c68c113"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
