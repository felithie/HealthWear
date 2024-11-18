import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { saveData, saveAdditionalDataToSubcollection, getDataForSpecificDate } from '../utilities/firebaseConfig';
import { Calendar } from 'react-native-calendars';
import { markDates, getCurrentDate } from "../utilities/heatmapLogic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SensorCalc } from '../utilities/sensorCalculations';
import { BleManager } from 'react-native-ble-plx';  // Assuming you're using `react-native-ble-plx`

export default function HomeScreen() {
  const router = useRouter();
  const currentDate = getCurrentDate();
  const [sensorPercent, setSensorPercent] = useState(80);
  const [sensorPercentColor, setSensorPercentColor] = useState("green");
  const [connectionStatus, setConnectionStatus] = useState("No device connected");
  const [receivedData, setReceivedData] = useState(null);

  const manager = new BleManager();
  const sensorCalculationObj = new SensorCalc();

  // Function to calculate color based on sensor percent
  const calculateColor = (value: number): string => {
    const normalizedValue = Math.min(Math.max(value, 0), 100) / 100; // Normalize between 0 and 1
  
    // Apply exponential weighting to make red appear earlier
    const adjustedValue = Math.pow(normalizedValue, 1.7); // Square root gives a faster transition
  
    const green = Math.round(255 * adjustedValue); // Increase red more quickly
    const red = Math.round(255 * (1 - adjustedValue)); // Decrease green more quickly
  
    return `rgb(${red}, ${green}, 0)`;
  };

  // Update the color whenever sensorPercent changes
  useEffect(() => {
    const newColor = calculateColor(sensorPercent);
    setSensorPercentColor(newColor);
  }, [sensorPercent]);

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

  // Log the date when a day is pressed
  const onDayPress = (day: any) => {
    const selectedDate = new Date(day.timestamp);
    getDataForSpecificDate(selectedDate);  // Logs the selected date
  };

  // Function to handle Bluetooth connection if characteristics are found in AsyncStorage
  const handleBluetoothConnection = async () => {
    try {
      const storedCharacteristics = await AsyncStorage.getItem('bluetoothCharacteristics');
      console.log(storedCharacteristics);
      if (storedCharacteristics) {
        const { serviceUUID, characteristicUUID } = JSON.parse(storedCharacteristics);
  
        // Start scanning for devices
        manager.startDeviceScan([serviceUUID], null, (error, device) => {
          if (error) {
            console.warn('Error scanning for devices:', error);
            return;
          }
  
          console.log('Discovered device:', device);
          // Check if the device matches the desired device
          if (device.name === 'LE_WH-1000XM4') {  // Check the device name if applicable
            manager.stopDeviceScan();  // Stop scanning once device is found
            
            // Attempt connection
            device.connect()
              .then((device) => {
                console.log('Device connected:', device);
                device.discoverAllServicesAndCharacteristics()
                  .then(() => {
                    console.log('Services and characteristics discovered');
                    setConnectionStatus('Device connected');
                    
                    // Subscribe to the characteristic
                    device.monitorCharacteristicForService(
                      serviceUUID,
                      characteristicUUID,
                      (error, characteristic) => {
                        if (error) {
                          console.warn("Error monitoring characteristic:", error);
                        } else {
                          const value = characteristic.value;
                          const decodedValue = value ? atob(value) : '';
                          setReceivedData(decodedValue); // Update the state with received data
                        }
                      }
                    );
                  })
                  .catch((err) => {
                    console.warn("Error discovering services:", err);
                  });
              })
              .catch((err) => {
                console.warn('Error connecting to device:', err);
                setConnectionStatus('Connection failed');
              });
          }
        });
      }
    } catch (error) {
      console.warn("Error retrieving Bluetooth characteristics:", error);
      setConnectionStatus('No device connected');
    }
  };
  
  
  
  

  // Initialize the Bluetooth connection when the component mounts
  useEffect(() => {
    handleBluetoothConnection();
  }, []);

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
            markedDates={markDates()}  // Dynamically pass the marked dates from `markDates`
            monthFormat={'yyyy MM'}
            onDayPress={onDayPress}  // Handle day press
          />
        </ScrollView>
      </View>

      <View style={styles.realtimeOverviewContainer}>
        <View style={[styles.realtimeCircle, { backgroundColor: sensorPercentColor }]} />
        <View style={styles.realtimeTextContainer}>
          <Text style={styles.realtimeText}>How you are doing:</Text>
          <Text style={styles.realtimePercent}>{sensorPercent}%</Text>
        </View>
      </View>

      <View style={styles.connectionStatusContainer}>
        <Text style={styles.connectionStatusText}>{connectionStatus}</Text>
        {receivedData && (
          <Text style={styles.receivedDataText}>Received Data: {receivedData}</Text>
        )}
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
  connectionStatusContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  connectionStatusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  receivedDataText: {
    fontSize: 16,
    marginTop: 10,
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
