
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getBondedDevices, connectToDevice, disconnectFromDevice, sendMessage, receiveMessage } from '../utilities/bluetoothService';

export default function BluetoothScreen() {
  const [bondedDevices, setBondedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    fetchBondedDevices();
  }, []);

  // Function to get the list of bonded devices
  const fetchBondedDevices = async () => {
    try {
      const devices = await getBondedDevices();
      setBondedDevices(devices);
      setSelectedDevice(devices.length > 0 ? devices[0] : null);
      setIsConnected(false); // Reset connection state when devices list is updated
    } catch (error) {
      console.warn("Error getting bonded devices:", error);
    }
  };

  // Handle device selection change
  const handleDeviceChange = async (deviceId) => {
    if (selectedDevice && isConnected) {
      await disconnectFromDevice(selectedDevice.id);
    }

    const newDevice = bondedDevices.find((device) => device.id === deviceId);
    setSelectedDevice(newDevice);
    setIsConnected(false); // Reset connection state for new device
  };

  // Connect to the selected device
  const handleConnectDevice = async () => {
    if (selectedDevice) {
      try {
        await connectToDevice(selectedDevice.id);
        setIsConnected(true);
      } catch (error) {
        console.warn("Error connecting to device:", error);
        Alert.alert("Error", "Failed to connect to the device");
      }
    }
  };

  // Disconnect from the selected device
  const handleDisconnectDevice = async () => {
    if (selectedDevice && isConnected) {
      try {
        await disconnectFromDevice(selectedDevice.id);
        setIsConnected(false);
      } catch (error) {
        console.warn("Error disconnecting from device:", error);
        Alert.alert("Error", "Failed to disconnect from the device");
      }
    }
  };

  // Send a test message to the connected device
  const handleSendMessage = async () => {
    if (isConnected) {
      try {
        await sendMessage("Hello from React Native client");
        console.log("Message sent to server");
      } catch (error) {
        console.warn("Error sending message:", error);
        Alert.alert("Error", "Failed to send message to the device");
      }
    } else {
      Alert.alert("Not Connected", "Please connect to a device first.");
    }
  };

  // Receive a message from the connected device
  const handleReceiveMessage = async () => {
    if (isConnected) {
      try {
        const message = await receiveMessage();
        setReceivedMessage(message);
        console.log("Message received from server:", message);
      } catch (error) {
        console.warn("Error receiving message:", error);
        Alert.alert("Error", "Failed to receive message from the device");
      }
    } else {
      Alert.alert("Not Connected", "Please connect to a device first.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Device Selection</Text>

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        data={bondedDevices}
        value={selectedDevice?.id}
        labelField="name"
        valueField="id"
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          handleDeviceChange(item.id);
        }}
        placeholder="Select a device"
      />

      {isConnected ? (
        <Text style={styles.connectionStatus}>Connected to {selectedDevice?.name}</Text>
      ) : (
        <Text style={styles.connectionStatus}>Not connected</Text>
      )}

      <TouchableOpacity onPress={handleConnectDevice} style={styles.button}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDisconnectDevice} style={styles.button}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleReceiveMessage} style={styles.button}>
        <Text style={styles.buttonText}>Receive Message</Text>
      </TouchableOpacity>

      {receivedMessage ? (
        <Text style={styles.receivedMessage}>Received: {receivedMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  icon: {
    marginRight: 5,
  },
  button: {
    backgroundColor: '#bd3a05',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  messageText: {
    fontSize: 16,
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
});