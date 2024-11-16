import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { saveData } from '../utilities/firebaseConfig';  
import { Calendar } from 'react-native-calendars'; // Importing the new calendar library
import ignoreWarnings from 'ignore-warnings';

ignoreWarnings([
  'Warning: CalendarHeatmap: Support for defaultProps will be removed from function components',
]);

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

  const getCurrentDate = () => {
    const date = new Date()
    return({
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    })
  }

  const getAmountOfMonthDays = (year: number, month: number) => {
    return(new Date(year, month, 0).getDate())
  }

  const transformIntoDateFormat = (day: number, month: number, year: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const currentDate = getCurrentDate();

  // Marked dates with example values
  const markedDates = {
    '2024-11-01': { selected: true, marked: true, selectedColor: 'red' },
    '2024-11-05': { selected: true, marked: true, selectedColor: 'green' },
    '2024-11-10': { selected: true, marked: true, selectedColor: 'blue' },
    '2024-11-12': { selected: true, marked: true, selectedColor: 'purple' },
    // Add more marked dates as needed
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">Welcome to the Health Device App!</ThemedText>
      </View>
      <View style={styles.graphContainer}>
        <Text style={{fontSize: 30, color: "#bd3a05", marginBottom: 10}}></Text>
        <View style={styles.heatmapContainer}>
          <ScrollView horizontal={false} contentContainerStyle={{ alignItems: 'center' }}>
            <Calendar
              current={`${currentDate.year}-${String(currentDate.month + 1).padStart(2, '0')}-${String(currentDate.day).padStart(2, '0')}`} // Set initial current date
              markedDates={markedDates} // Apply the marked dates
              monthFormat={'yyyy MM'} // Display the month above the calendar
              onDayPress={(day) => {  }} // Log the selected day
              hideExtraDays={true} // Hide days outside the current month
              theme={{
                dayStyle: {
                  width: 40, // Set width for day cells (square)
                  height: 40, // Set height for day cells (square)
                  alignItems: 'center', // Center text inside the square
                  justifyContent: 'center', // Center text inside the square
                  borderRadius: 0, // Ensure no rounding
                  backgroundColor: 'transparent', // Make background transparent (or you can set a color if needed)
                },
                selectedDayStyle: {
                  backgroundColor: 'green', // Color for the selected day
                },
                todayTextColor: 'blue', // Color for today text
                dayTextColor: '#333', // Default color for day numbers
                arrowColor: 'black', // Color of the arrows (next/previous month)
              }}
            />
          </ScrollView>
        </View>
      </View>
      <View style={styles.firstChildContainer}>
        <View style={styles.contentContainer}>
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
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  titleContainer: {
    marginTop: 100,
    marginHorizontal: 20,
  },
  firstChildContainer: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    width: '100%',
    height: 'auto',
  },
  graphContainer: {
    height: "100%",
    width: "100%",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  heatmapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
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
