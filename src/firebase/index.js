import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCIf95xdHan02_npaf24MYE9g_E0DWZRcw',
  authDomain: 'test-59f34.firebaseapp.com',
  projectId: 'test-59f34',
  storageBucket: 'test-59f34.appspot.com',
  messagingSenderId: '812911097556',
  appId: '1:812911097556:web:43483f7baaeb80cf53ad41'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{
  db
}