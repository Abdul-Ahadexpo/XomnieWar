import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC0RR6otjMbOlMcCKglZvoI1J9mCvzn81M",
  authDomain: "orderpro-da07b.firebaseapp.com",
  databaseURL: "https://orderpro-da07b-default-rtdb.firebaseio.com",
  projectId: "orderpro-da07b",
  storageBucket: "orderpro-da07b.firebasestorage.app",
  messagingSenderId: "135142400241",
  appId: "1:135142400241:web:457d97504eb6eac695c950"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;