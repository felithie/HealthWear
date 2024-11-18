import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { saveData, saveAdditionalDataToSubcollection, getDataForSpecificDate } from '../utilities/firebaseConfig';  
import { Calendar } from 'react-native-calendars';
import { markDates, getCurrentDate } from "../utilities/heatmapLogic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SensorCalc } from '../utilities/sensorCalculations';

export default function HomeScreen() {
  const router = useRouter();
  const currentDate = getCurrentDate();
  const [sensorPercentColor, setSensorPercentColor] = useState("green");
  const [pressure, setPressure] = useState(String);

  const sensorCalculationObj = new SensorCalc();

  // Function to calculate color based on sensor percent
  const calculateColor = (pressure: number): string => {
    const value = 100 - (pressure / 82.5) * 100; 
    const normalizedValue = Math.min(Math.max(value, 0), 100) / 100; // Normalize between 0 and 1
  
    // Apply exponential weighting to make red appear earlier
    const adjustedValue = Math.pow(normalizedValue, 1.7); // Square root gives a faster transition
  
    const green = Math.round(255 * adjustedValue); // Increase red more quickly
    const red = Math.round(255 * (1 - adjustedValue)); // Decrease green more quickly
  
    return `rgb(${red}, ${green}, 0)`;
  };
  

  // Update the color whenever sensorPercent changes
  useEffect(() => {
    const newColor = calculateColor(Number(pressure));
    setSensorPercentColor(newColor);
  }, [pressure]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedPressure = await AsyncStorage.getItem('pressure');
      if (fetchedPressure) {
        setPressure(fetchedPressure);
        console.log(fetchedPressure);
      }
    }, 1000); // Fetch every 1 second
  
    return () => clearInterval(interval); // Clear the interval on unmount
  }, []);

  // Memoize the markedDates to avoid unnecessary recalculations
  const markedDatesMemo = useMemo(() => markDates(), []); // Only calculate once on initial render

  // Handle saving data to Firebase
  const handleSaveData = async () => {
    try {
      await saveData();
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  // Fetch user credentials and redirect if not logged in
  const fetchUserCredentials = async () => {
    const user = await AsyncStorage.getItem('userCredentials');
    if (!user) {
      Alert.alert("User not logged in", "Please log in again.");
      router.push('/(tabs)/register'); // Redirect to register if no user
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userCredentials');
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      router.push('/(tabs)/register'); // Redirect to Register screen after logging out
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', 'There was an issue logging out. Please try again.');
    }
  };

  React.useEffect(() => {
    fetchUserCredentials();
  }, []);

  // Log the date when a day is pressed
  const onDayPress = (day: any) => {
    const selectedDate = new Date(day.timestamp);
    getDataForSpecificDate(selectedDate);  // Logs the selected date
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">
          Welcome to the Health Device App!
        </ThemedText>
      </View>
      
      <View style={styles.graphContainer}>
        <ScrollView horizontal={false} contentContainerStyle={{ alignItems: 'center' }}>
          <Calendar
            markingType="custom"  // Use custom marking type
            current={`${currentDate.year}-${String(currentDate.month + 1).padStart(2, '0')}-${String(currentDate.day).padStart(2, '0')}`} 
            markedDates={markedDatesMemo}  // Use the memoized marked dates
            monthFormat={'yyyy MM'}
            onDayPress={onDayPress}  // Handle day press
          />
        </ScrollView>
      </View>
      <View style={styles.realtimeOverviewContainer}>
        <View style={[styles.realtimeCircle, { backgroundColor: sensorPercentColor }]} />
        <View style={styles.realtimeTextContainer}>
          <Text style={styles.realtimeText}>How you are doing:</Text>
          <Text style={styles.realtimePercent}>{(100 - Number(pressure) / 82.5 * 100).toFixed(1)}%</Text>
        </View>
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.normalButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.normalButton} onPress={async () => saveAdditionalDataToSubcollection(Math.floor(Math.random() * 100))}>
          <Text style={styles.buttonText}>Test Data Upload</Text>
        </TouchableOpacity>
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
  },
  graphContainer: {
    height: "auto", 
    justifyContent: "center",
    alignItems: "center",
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
  },
  realtimeText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  realtimePercent: {
    fontSize: 25,
    fontWeight: "bold"
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
