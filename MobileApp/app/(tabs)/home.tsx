// HomeScreen.js
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">Welcome to the Health Device App!</ThemedText>
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
          <Link href="/(tabs)\bluetoothSettings" asChild>
            <TouchableOpacity style={styles.normalButton}>
              <Text style={styles.buttonText}>Go to Bluetooth Devices</Text>
            </TouchableOpacity>
          </Link>
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
  titleText: {
    color: '#bd3a05',
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
