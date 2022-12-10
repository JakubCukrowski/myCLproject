import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCB_0ATprY0MbJbv6X6biuiiY2OMjgjAps",
    authDomain: "cl-project-cf466.firebaseapp.com",
    projectId: "cl-project-cf466",
    storageBucket: "cl-project-cf466.appspot.com",
    messagingSenderId: "265755021288",
    appId: "1:265755021288:web:8e77d4aabafc4505f29e5d",
    measurementId: "G-VG22S7XQVB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)

export default app