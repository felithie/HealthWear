import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, arrayUnion, setDoc, query, where } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyB1zjwDB3tSigXRnSbHGH7Nf8AwxOzTVLY',
    projectId: 'healthdevice-89a7e',
    messagingSenderId: '708390894238',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let authInstance: any;

export const checkFirebaseAuth = () => {
    if (authInstance) {
        return authInstance;
    }

    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    return authInstance;
};

// Function to get the current logged-in user's UID
const getUserId = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (currentUser) {
    return currentUser.uid;
  } else {
    throw new Error("No user is logged in");
  }
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

/**
 * Save additional data (integer value with a timestamp) to the user's document.
 */
export const saveAdditionalData = async (value: number) => {
  try {
    const userId = getUserId(); // Automatically get userId
    const userRef = doc(db, 'Users', userId);

    // Add a new entry to the 'data' array in the user's document
    await updateDoc(userRef, {
      data: arrayUnion({
        value: value,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log("Additional data saved successfully!");
  } catch (error) {
    console.error("Error saving additional data:", error);
  }
};

/**
 * Save additional data (integer value with a timestamp) to a user's subcollection.
 */
/**
 * Save additional data (integer value with a timestamp) to a user's subcollection.
 */
export const saveAdditionalDataToSubcollection = async (value: any) => {
  try {
    const userId = getUserId(); // Automatically get userId
    const timestamp = new Date().toISOString(); // Use timestamp as the document ID

    // Reference the 'additionalData' subcollection under the user's document
    const subcollectionRef = collection(db, 'Users', userId, 'additionalData');

    // Add a new document with the timestamp as the document ID
    await setDoc(doc(subcollectionRef, timestamp), {
      value: value,
      timestamp: timestamp,
    });

    console.log("Additional data saved to subcollection successfully!");
  } catch (error) {
    console.error("Error saving additional data to subcollection:", error);
  }
};



// Function to get data for today
export const getDataForSpecificDate  = async (selectedDate: Date) => {

  const userId = getUserId(); // Automatically get userId
  const date = new Date(selectedDate);
  
  // Calculate start and end of the day for the selected date
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));  // Set to midnight
  const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Set to the end of the day
  
  // Convert to ISO string for comparison (Firestore stores dates as ISO strings)
  const startOfDayISOString = startOfDay.toISOString();
  const endOfDayISOString = endOfDay.toISOString();
  
  const additionalDataRef = collection(db, 'Users', userId, 'additionalData');
  
  // Query for data between the start and end of the selected day
  const q = query(
    additionalDataRef,
    where('timestamp', '>=', startOfDayISOString),
    where('timestamp', '<=', endOfDayISOString)
  );

  const querySnapshot = await getDocs(q);
  
  const dataForSelectedDate: any = [];
  querySnapshot.forEach((doc) => {
    dataForSelectedDate.push(doc.data());
  });
  
  console.log(dataForSelectedDate); // Log the data
  return dataForSelectedDate;
};
