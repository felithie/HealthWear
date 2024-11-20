import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean);



  useEffect(() => {
    const checkUserLogin = async () => {
      const storedUser = await AsyncStorage.getItem('userCredentials');
      if (storedUser) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
        
      try {
        await AsyncStorage.removeItem("pressure");
        console.log("Deleted")
      }
      catch(exception) {
          console.log(exception);
      }
  
    };

    checkUserLogin();
  }, []);

  // Wait until the login check completes before rendering the page
  if (isLoggedIn === null) {
    return null; // You can show a loading spinner or just return null while checking
  }


  // If logged in, redirect to Home, otherwise to Register
  return isLoggedIn ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(tabs)/register" />;
}
