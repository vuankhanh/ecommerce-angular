import { FirebaseOptions } from "firebase/app";

const firebase: FirebaseOptions = {
  apiKey: "AIzaSyBv_00demp-MIGOOY7xKBgF-k_stiSRBDA",
  authDomain: "bep4than-c176a.firebaseapp.com",
  projectId: "bep4than-c176a",
  storageBucket: "bep4than-c176a.firebasestorage.app",
  messagingSenderId: "431656754138",
  appId: "1:431656754138:web:8a5785b59a9a3b67953ee3",
  measurementId: "G-N6VHY1GMXW"
}

export const environment = {
  backendApi: 'http://localhost:3011/api',
  backendStatic: 'http://localhost:3004/static',
  socket: 'http://localhost:3011',
  firebase
};