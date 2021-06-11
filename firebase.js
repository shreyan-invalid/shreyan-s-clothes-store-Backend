const firebase= require('firebase');


const firebaseConfig = {
    apiKey: "AIzaSyCBj6GJQuzFcI8tIzwpK2S76wZbsJpqboQ",
    authDomain: "shreyan-s-store.firebaseapp.com",
    projectId: "shreyan-s-store",
    storageBucket: "shreyan-s-store.appspot.com",
    messagingSenderId: "1006153298329",
    appId: "1:1006153298329:web:75c279b76c5581954ba308",
    measurementId: "G-T4H4Q9DSSV"
};


const app= !firebase.apps.length? firebase.initializeApp(firebaseConfig)
: firebase.app();

const db= app.firestore();

module.exports= db;


