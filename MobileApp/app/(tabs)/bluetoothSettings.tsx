import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getBondedDevices, connectToDevice, disconnectFromDevice } from '../utilities/bluetoothService';

export default function BluetoothScreen() {
  const [bondedDevices, setBondedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

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
      // Disconnect from the currently connected device if any
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

  // Render the dropdown menu with device names as labels and ids as values
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Device Selection</Text>

      {/* Dropdown for selecting device */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={bondedDevices.map((device) => ({
          label: device.name,   // Device name as the label
          value: device.id,     // Device id as the value for interaction
        }))}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select device' : '...'}
        value={selectedDevice ? selectedDevice.id : null}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => handleDeviceChange(item.value)} // Use the device ID as value
        search
        maxHeight={300}
        searchPlaceholder="Search..."
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? 'blue' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />

      {/* Update button to refresh the bonded devices */}
      <TouchableOpacity style={styles.button} onPress={fetchBondedDevices}>
        <Text style={styles.buttonText}>Update Device List</Text>
      </TouchableOpacity>

      {/* Connect/Disconnect button */}
      {selectedDevice ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isConnected ? 'red' : '#bd3a05' }]}
          onPress={isConnected ? handleDisconnectDevice : handleConnectDevice}
        >
          <Text style={styles.buttonText}>{isConnected ? 'Disconnect' : 'Connect'}</Text>
        </TouchableOpacity>
      ) : (
        <Text>No bonded devices found.</Text>
      )}
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
});
