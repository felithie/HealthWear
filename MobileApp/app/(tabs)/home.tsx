import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { saveData } from '../utilities/firebaseConfig';  
import Svg, { Rect } from 'react-native-svg';  

const Heatmap = ({ values, width, height }) => {
  const cellSize = 30; 
  const rows = Math.ceil(values.length / 7); 

  return (
    <Svg width={width} height={height}>
      {values.map((value, index) => {
        const x = (index % 7) * cellSize; 
        const y = Math.floor(index / 7) * cellSize; 
        const color = value.count
          ? `rgb(${Math.min(255, value.count * 10)}, 0, 0)`
          : 'white';

        return (
          <Rect
            key={index}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            fill={color}
            stroke="gray"
            strokeWidth="0.5"
          />
        );
      })}
    </Svg>
  );
};

export default function HomeScreen() {
  
  const handleSaveData = async () => {
    try {
      await saveData();
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  const getDates = () => {
    const daysInMonth = (year, month) => new Date(year, month, 0).getDate(); // Get the total number of days in the month
    let daysArray = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-indexed
  
    // Loop over all the days in the month and create an object for each day
    for (let i = 1; i <= daysInMonth(year, month); i++) {
      daysArray.push({
        date: `${year}-${month < 10 ? '0' + month : month}-${i < 10 ? '0' + i : i}`, // Format the date as YYYY-MM-DD
        count: 12 // You can modify this with dynamic data later
      });
    }
  
    console.log(daysArray);
    return daysArray;
  };

  // Directly assign the dates array to heatmapData
  const heatmapData = getDates();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">Welcome to the Health Device App!</ThemedText>
      </View>
      <View style={styles.graphContainer}>
        <Text>Heatmap</Text>
        <View style={styles.heatmapContainer}>
          <Heatmap values={heatmapData} width={500} height={300} />
        </View>
      </View>
      <View style={styles.firstChildContainer}>
        <View style={styles.contentContainer}>
          <Link href="/register" asChild>
            <TouchableOpacity style={styles.normalButton}>
              <Text style={styles.buttonText}>Go to Register</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/explore" asChild>
            <TouchableOpacity style={styles.normalButton}>
              <Text style={styles.buttonText}>Go to Explore</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/bluetoothSettings" asChild>
            <TouchableOpacity style={styles.normalButton}>
              <Text style={styles.buttonText}>Go to Bluetooth Devices</Text>
            </TouchableOpacity>
          </Link>

          {/* New button to trigger saveData */}
          <TouchableOpacity style={styles.normalButton} onPress={handleSaveData}>
            <Text style={styles.buttonText}>Save User Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  titleContainer: {
    marginTop: 100,
    marginHorizontal: 20,
  },
  firstChildContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  heatmapContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  titleText: {
    color: '#bd3a05',
  },
  graphView: {
    height: "100%",
    width: "100%"
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
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
