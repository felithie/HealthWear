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
      }
      catch(exception) {
          console.log(exception);
      }
    };

    checkUserLogin();
  }, []);

  if (isLoggedIn === null) {
    return null; // You can show a loading spinner or just return null while checking
  }

  return isLoggedIn ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(tabs)/register" />;
}
