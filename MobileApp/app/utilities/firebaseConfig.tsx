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
export const saveAdditionalDataToSubcollection = async (data: { value: number; timestamp?: string }) => {
  try {
    const userId = getUserId(); // Automatically get userId
    const timestamp = data.timestamp || new Date().toISOString(); // Use provided timestamp or generate one

    // Reference the 'additionalData' subcollection under the user's document
    const subcollectionRef = collection(db, 'Users', userId, 'additionalData');

    // Add a new document with the timestamp as the document ID
    await setDoc(doc(subcollectionRef, timestamp), {
      value: data.value,
      timestamp: timestamp,
    });

    console.log("Additional data saved to subcollection successfully!");
  } catch (error) {
    console.error("Error saving additional data to subcollection:", error);
  }
};


// Function to generate and save data for the last few days
export const generateAndSavePressureData = async (days: number) => {
  const now = new Date();

  for (let day = 0; day < days; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Generate timestamp for each hour
      const timestamp = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - day,
        hour
      ).toISOString();

      // Generate random pressure value between 0 and 50
      const pressureValue = parseFloat((Math.random() * 50).toFixed(2));

      // Save data to subcollection
      await saveAdditionalDataToSubcollection({ value: pressureValue, timestamp });
    }
  }

  console.log("Generated and saved pressure data for the last", days, "days.");
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
  
  return dataForSelectedDate;
};

export const getDataForDateRange = async (startDate: Date, endDate: Date) => {
  const userId = getUserId(); // Automatically get the logged-in userId

  // Set start time to 00:00:00 for startDate and end time to 23:59:59 for endDate
  const startOfDay = new Date(startDate);
  startOfDay.setHours(0, 0, 0, 0);  // Start of the day

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);  // End of the day

  // Convert dates to ISO string format for Firestore comparison
  const startISOString = startOfDay.toISOString();
  const endISOString = endOfDay.toISOString();

  // Reference the 'additionalData' subcollection for the specific user
  const additionalDataRef = collection(db, 'Users', userId, 'additionalData');

  // Firestore query to get documents where timestamp is between start and end date
  const q = query(
    additionalDataRef,
    where('timestamp', '>=', startISOString),
    where('timestamp', '<=', endISOString)
  );

  // Execute query
  const querySnapshot = await getDocs(q);

  // This will hold the data grouped by day
  const groupedData: { [key: string]: { time: string, value: number }[] } = {};

  // Loop through the query result
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const timestamp = new Date(data.timestamp);
    const value = data.value;

    // Get the day (formatted as YYYY-MM-DD)
    const dayKey = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')}`;
    
    // Create the structure if it doesn't exist
    if (!groupedData[dayKey]) {
      groupedData[dayKey] = [];
    }

    // Add the entry for this hour
    groupedData[dayKey].push({
      time: timestamp.toISOString(),  // Store the exact timestamp for the hour
      value: value
    });
  });

  // Convert the grouped data into an array for easier use or return
  const structuredData = Object.keys(groupedData).map(day => ({
    day,
    data: groupedData[day]
  }));

  return structuredData;
};
