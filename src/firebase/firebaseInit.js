import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHx5emUI6biJ_cpE7cIfAitYupJbLqc_k",
  authDomain: "newssite-8b2f6.firebaseapp.com",
  projectId: "newssite-8b2f6",
  storageBucket: "newssite-8b2f6.appspot.com",
  messagingSenderId: "720946599939",
  appId: "1:720946599939:web:da95ceb17eac8c958fd636",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();
