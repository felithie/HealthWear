import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { storeData, checkFirebaseAuth } from "../utilities/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Link, useRouter, useFocusEffect } from 'expo-router';

const auth = checkFirebaseAuth();
const db = getFirestore();


export default function Register() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const router = useRouter()

  const removeTrailingSpace = () => {
    if (typeof email !== 'string') {
      throw new Error("Input must be a string");
    }
    
     onChangeEmail(email.endsWith(" ") ? email.trimEnd() : email);
  };
  

  useEffect(() => {
    const storeAuthData = async () => {
      await storeData(auth.currentUser);
    };
    storeAuthData();
  }, []);

  const handleRegister = async () => {
    try {
      removeTrailingSpace()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a Firestore document for the new user
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        additionalData: [], // Initialize an array for storing future data
      });

      console.log("User database created successfully!");


      router.replace('/(tabs)/home');


    } catch (error: any) {
      console.error("Error registering user:", error.code, error.message);
      Alert.alert(
        "Invalid Email or Password.",
        error.message,
        [
          {
            text: 'Understood',
            style: 'default',
          },
        ],
        )
    }
  };

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
            placeholder="Enter your email"
          />
        </View>
        <View style={styles.childLoginContainer}>
          <Text style={styles.registerText}>Password:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Enter your password"
            secureTextEntry={true} 
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.normalButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Link href="/(tabs)/userLogin" asChild>
            <TouchableOpacity style={styles.normalButton}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  titleContainer: {
    marginTop: 100,
    marginHorizontal: 20,
  },
  titleText: {
    color: "#bd3a05",
  },
  registerText: {
    fontSize: 20,
  },
  mainLoginContainer: {
    justifyContent: "center",
  },
  childLoginContainer: {
    marginHorizontal: 20,
    marginTop: 40,
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
    fontSize: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
