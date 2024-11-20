import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Alert, Vibration, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { getDataForSpecificDate, generateAndSavePressureData } from '../utilities/firebaseConfig';  
import { Calendar } from 'react-native-calendars';
import { markDates, getCurrentDate } from "../utilities/heatmapLogic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams  } from 'expo-router';
import { SensorCalc } from '../utilities/sensorCalculations';

export default function HomeScreen() {
  const router = useRouter();
  const currentDate = getCurrentDate();
  const [sensorPercentColor, setSensorPercentColor] = useState("green");
  const [pressure, setPressure] = useState(null);
  const [markedDates, setmarkedDates] = useState({});

  let counter = 0

  const calculateColor = (pressure: number): string => {
    console.log(pressure)
    if(pressure === null) {
      return "grey"
    }
    const value = 100 - (pressure / 82.5) * 100; 
    const normalizedValue = Math.min(Math.max(value, 0), 100) / 100; // Normalize between 0 and 1
  
    const adjustedValue = Math.pow(normalizedValue, 0.7); // Square root gives a faster transition
  
    const red = Math.round(255 * adjustedValue); // Increase red more quickly
    const green = Math.round(255 * (1 - adjustedValue)); // Decrease green more quickly
    

    return `rgb(${red}, ${green}, 0)`;
  };

  const sensorCalculationObj = new SensorCalc();

  useEffect(() => {
    const fetchMarkedDates = async () => {
      try {
        const dates = await markDates(); // Assume markDates returns a promise
        setmarkedDates(dates);
      } catch (error) {
        console.error("Error fetching marked dates:", error);
      }
    };
  
    fetchMarkedDates();
  }, []);

  useEffect(() => {
    if (pressure !== null) {
      const newColor = calculateColor(Number(pressure)); // Calculate the color based on the pressure
      setSensorPercentColor(newColor); // Update the sensorPercentColor state
    }
  }, [pressure]); // Re-run this effect whenever pressure changes
  

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedPressure = await AsyncStorage.getItem('pressure');


      if((100 - Number(fetchedPressure) / 82.5 * 100) < 80) {
        counter++
        if(counter >= 10) {
          Vibration.vibrate(1000)
        }
      } else {
        counter = 0
        Vibration.cancel()
      }

      if (fetchedPressure) {
        setPressure(fetchedPressure);
      }
    }, 1000); 
  
    return () => clearInterval(interval); // Clear the interval on unmount
  }, []);


  // Fetch user credentials and redirect if not logged in
  const fetchUserCredentials = async () => {
    const user = await AsyncStorage.getItem('userCredentials');
    if (!user) {
      Alert.alert("User not logged in", "Please log in again.");
      router.push('/(tabs)/register'); // Redirect to register if no user
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userCredentials');
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      router.push('/(tabs)/register'); 
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', 'There was an issue logging out. Please try again.');
    }
  };

  React.useEffect(() => {
    fetchUserCredentials();
  }, []);

  const onDayPress = async (day: any) => {
    try {
      const selectedDate = new Date(day.timestamp);
      const data = await getDataForSpecificDate(selectedDate);
      router.push({
        pathname: "/(tabs)/dayGraph",
        params: { graphData: JSON.stringify(data) }, 
     });
    } catch(error) {
      console.log(error)
    }
    };
  

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">
          Welcome to Backtrack!
        </ThemedText>
        <Image
        source={require('./backtrack.webp')}
        style={styles.titleImage}
      />
      </View>
      
      <View style={styles.graphContainer}>
          <Calendar
            style={styles.calendar}
            markingType="custom"  // Use custom marking type
            current={`${currentDate.year}-${String(currentDate.month + 1).padStart(2, '0')}-${String(currentDate.day).padStart(2, '0')}`} 
            markedDates={markedDates}  // Use the memoized marked dates
            monthFormat={'yyyy MM'}
            onDayPress={onDayPress}  // Handle day press
          />
      </View>
      <View style={styles.realtimeOverviewContainer}>
        <View style={[styles.realtimeCircle, { backgroundColor: sensorPercentColor }]} />
        <View style={styles.realtimeTextContainer}>
          <Text style={styles.realtimeText}>How you are doing:</Text>
          <Text style={styles.realtimePercent}>{pressure === null ? (100 - Number(pressure) / 82.5 * 100).toFixed(1) + "%" : "No device connected"}</Text>
        </View>
      </View>
      <View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.normalButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.normalButton} onPress={async () =>  router.replace("/(tabs)/dayGraph")}>
            <Text style={styles.buttonText}>Test Vibrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-between',  // Space out content
  },
  titleContainer: {
    marginTop: 100,
    marginHorizontal: 20,
    flexDirection: "row"
  },
  graphContainer: {
    height: "auto", 
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  calendar: {
    height: "auto", 
    width: 350,  
    borderWidth: 1,
    borderColor: '#bd3a05',
  },  
  realtimeOverviewContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },
  realtimeTextContainer: {
    marginLeft: 20
  },
  realtimeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  titleText: {
    color: '#bd3a05',
    width: "70%",
    textAlign: "center"
  },
  realtimeText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  realtimePercent: {
    fontSize: 25,
    fontWeight: "bold"
  },
  titleImage: {
    width: 70,
    height: 70,
    borderRadius: 40
  },
  normalButton: {
    width: '80%',
    maxWidth: 200,
    height: 60,
    backgroundColor: '#bd3a05',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  logoutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,  // Spacing for the logout section
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
