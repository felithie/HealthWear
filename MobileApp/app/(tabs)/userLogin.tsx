import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkFirebaseAuth } from '../utilities/firebaseConfig'; // Assuming this is your Firebase auth config
import { useRouter } from 'expo-router';

const auth = checkFirebaseAuth(); // Firebase authentication instance

export default function Login() {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true); // Start loading state

    try {
      // Attempt to sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data in AsyncStorage
      await AsyncStorage.setItem('userCredentials', JSON.stringify({
        uid: user.uid,
        email: user.email,
      }));

      // Redirect to Home screen after successful login
      Alert.alert('Login Successful', 'Welcome to the Home Screen!');
      router.push("/(tabs)/home");

    } catch (error: any) {
      // Handle errors (incorrect credentials, etc.)
      console.error("Login error: ", error.message);
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">
          Login to your account
        </ThemedText>
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
            secureTextEntry
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.normalButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
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
  mainLoginContainer: {
    justifyContent: 'center',
  },
  childLoginContainer: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  titleText: {
    color: '#bd3a05',
  },
  registerText: {
    fontSize: 20,
  },
  normalButton: {
    width: '80%',
    maxWidth: 200,
    height: 60,
    backgroundColor: '#bd3a05',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 50,
  },
  buttonView: {
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
