import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { storeData, checkFirebaseAuth } from "../utilities/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'expo-router';


const auth = checkFirebaseAuth()

export default function Login() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  useEffect(() => {
      const storeAuthData = async() => {
          await storeData(auth.currentUser);
      };
      storeAuthData();
  }, []);

  return(
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">Login screen!</ThemedText>
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
            secureTextEntry={true} 
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.normalButton} onPress={() =>  
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              console.log("Registered")
              const user = userCredential.user;
              console.log(user)
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            })
            }>
            <Text style={{
              fontSize: 20,
              color: "white"
            }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
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
    marginTop: 50,
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
