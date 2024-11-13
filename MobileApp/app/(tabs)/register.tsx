import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { storeData, getData, saveData, checkFirebaseAuth } from "../utilities/firebaseConfig"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


const auth = checkFirebaseAuth()

function registerUser (email: string, password: string) {

  createUserWithEmailAndPassword(auth, email, password)

  .then((userCredential) => {
    console.log("Registered")
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

export default function Register() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

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
      <View style={styles.mainLoginContainer}>
        <View style={styles.childLoginContainer}>
          <Text style={styles.registerText}>Email:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Hier ihre Email"
          />
        </View>
        <View style={styles.childLoginContainer}>
          <Text style={styles.registerText}>Password:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Hier ihr Passwort"
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.normalButton} onPress={() =>  registerUser(email, password)}>
            <Text>
              Registrieren
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white"
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
  mainLoginContainer: {
    justifyContent: "center",

  },
  childLoginContainer: {
    marginHorizontal: 20,
    marginTop: 40
  },
  titleText: {
    color: "#bd3a05",
  },
  registerText: {
    fontSize: 20
  },
  normalButton: {
    width: "80%",
    maxWidth: 200,
    height: 60,
    backgroundColor: "#bd3a05",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonView: {
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
})
