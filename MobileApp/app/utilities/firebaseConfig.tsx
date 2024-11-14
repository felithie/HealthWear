import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyB1zjwDB3tSigXRnSbHGH7Nf8AwxOzTVLY',
    projectId: 'healthdevice-89a7e',
    messagingSenderId: '708390894238',
};

// Initialize Firebase app if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let authInstance;

export const checkFirebaseAuth = () => {
    // Return the existing auth instance if it's already initialized
    if (authInstance) {
        return authInstance;
    }
    
    // Initialize auth if it hasn't been initialized yet
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    return authInstance;
};

export const storeData = async (value: Object | null) => {
  try {
    const jsonValue = JSON.stringify(value);
    await ReactNativeAsyncStorage.setItem('my-key', jsonValue);
  } catch (e) {
    console.error("Error saving data: ", e);
  }
};

export const getData = async () => {
  try {
    const usersCol = collection(db, 'Users');
    const usersSnap = await getDocs(usersCol);
    return usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};

export const saveData = async () => {
  const usersCol = collection(db, 'Users');
  const newUserData = {
    username: "testuser",
    email: "testuser@example.com",
    password: "test",
    createdAt: new Date(),
  };
  try {
    const docRef = await addDoc(usersCol, newUserData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
