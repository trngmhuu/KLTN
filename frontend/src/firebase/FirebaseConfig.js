import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBFqXlsy-Y-JMGAw0uPRUFZMqDRLN4sfSU",
    authDomain: "travelweb-f6aed.firebaseapp.com",
    projectId: "travelweb-f6aed",
    storageBucket: "travelweb-f6aed.firebasestorage.app",
    messagingSenderId: "328747584340",
    appId: "1:328747584340:web:796c13dbe7d158e28e56c1",
    databaseURL: "https://travelweb-f6aed-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Kết nối tới Realtime Database
const database = getDatabase(app);

export { database };