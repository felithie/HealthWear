import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { storeData, getData, saveData, checkFirebaseAuth } from "../utilities/firebaseConfig"

const auth = checkFirebaseAuth()

export default function Register() {
  useEffect(() => {
      const storeAuthData = async() => {
          await storeData(auth.currentUser);
      };
      storeAuthData();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">Register screen!</ThemedText>
      </View>
      <View>
        <Text>Email:</Text>
        <Text>Password:</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFECB"
  },
  titleContainer: {
    marginTop: 100,
    marginHorizontal: 20
  },
  firstChildContainer: {
    justifyContent: "center",
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center"
  },
  titleText: {
    color: "#37AFE1",
  },
  normalButton: {
    width: "80%",
    maxWidth: 200,
    height: 60,
    backgroundColor: "#4CC9FE",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20
  }
})