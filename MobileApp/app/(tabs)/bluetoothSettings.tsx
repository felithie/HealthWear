import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { atob } from 'react-native-quick-base64';

let manager = new BleManager();

export default function BluetoothScreen() {
  const [scannedDevices, setScannedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [receivedData, setReceivedData] = useState("");  // State to hold received data

  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  // Start scanning for devices named "Team4" only
  const startScan = () => {
    setIsScanning(true);
    setScannedDevices([]); // Clear previous scan results

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn("Error scanning for devices:", error);
        setIsScanning(false);
        return;
      }

      // Check if the device's name is "Team4" and if it's not already in the list
      if (device && device.name === "Team4" && device.id && !scannedDevices.find(d => d.id === device.id)) {
        setScannedDevices(prevDevices => [...prevDevices, device]);
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  // Connect to a selected device
  let subscription = null; // Global variable to hold the subscription

  // Connect to a selected device
  const handleConnectDevice = async (device) => {
    if (device) {
      try {
        await device.connect();
        setSelectedDevice(device);
        setIsConnected(true);
  
        // Discover all services and characteristics
        await device.discoverAllServicesAndCharacteristics();
  
        // Subscribe to notifications on the characteristic
        subscription = device.monitorCharacteristicForService(
          '0000180f-0000-1000-8000-00805f9b34fb', // Service UUID
          '00002a37-0000-1000-8000-00805f9b34fb', // Characteristic UUID
          (error, characteristic) => {
            if (error) {
              console.warn("Error monitoring characteristic:", error);
            } else {
              const value = characteristic.value;
              const decodedValue = value ? atob(value) : '';
              setReceivedData(decodedValue);  // Set the received data
            }
          }
        );
  
      } catch (error) {
        console.warn("Error connecting to device:", error);
        Alert.alert("Error", "Failed to connect to the device");
      }
    }
  };
  
  // Disconnect from the connected device
  const handleDisconnectDevice = async () => {
    if (selectedDevice) {
      try {
        console.log("Disconnecting from device:", selectedDevice);
  
        // Unsubscribe from characteristic monitoring if active
        if (subscription) {
          subscription.remove();
          subscription = null;
        }
  
        // Disconnect the device
        await manager.cancelDeviceConnection(selectedDevice.id);
        setIsConnected(false);
        setSelectedDevice(null);
  
      } catch (error) {
        console.warn("Error disconnecting from device:", error);
        Alert.alert("Error", "Failed to disconnect from the device");
      } finally {
        manager.destroy();
        manager = new BleManager();
      }
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Devices</Text>

      <TouchableOpacity onPress={startScan} style={styles.button}>
        <Text style={styles.buttonText}>{isScanning ? "Scanning..." : "Scan for 'Team4'"}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Discovered Devices</Text>
      <FlatList
        data={scannedDevices}
        keyExtractor={(item, index) => `${item.id}-${index}`}  // Ensuring unique keys
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleConnectDevice(item)}
            style={styles.deviceItem}
          >
            <Text style={styles.deviceText}>{item.name || "Unnamed Device"}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />

      {isConnected && selectedDevice && (
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionStatus}>Connected to {selectedDevice.name}</Text>
          
          {/* Show the received data */}
          {receivedData ? (
            <Text style={styles.receivedData}>Received Data: {receivedData}</Text>
          ) : (
            <Text style={styles.receivedData}>Waiting for data...</Text>
          )}

          {/* Disconnect button */}
          <TouchableOpacity onPress={handleDisconnectDevice} style={styles.button}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceText: {
    fontSize: 16,
    color: 'black',
  },
  deviceId: {
    fontSize: 12,
    color: 'gray',
  },
  connectionInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  connectionStatus: {
    fontSize: 18,
    color: 'green',
  },
  receivedData: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
});
