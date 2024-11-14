import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

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

  // Start scanning for devices
  const startScan = () => {
    setIsScanning(true);
    setScannedDevices([]); // Clear previous scan results

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn("Error scanning for devices:", error);
        setIsScanning(false);
        return;
      }

      // Check if the device has a name, ID, and if it's already in the list
      if (device && device.name && device.id && !scannedDevices.find(d => d.id === device.id)) {
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
  const handleConnectDevice = async (device) => {
    if (device) {
      try {
        await device.connect();
        setSelectedDevice(device);
        setIsConnected(true);

        // Discover services and characteristics once connected
        const services = await device.discoverAllServicesAndCharacteristics();

        // Find the characteristic you want to read from (this is a placeholder UUID)
        const characteristic = await device.readCharacteristicForService(
          'your-service-uuid', // Replace with your service UUID
          'your-characteristic-uuid' // Replace with your characteristic UUID
        );

        // Subscribe to notifications if the characteristic supports it
        device.monitorCharacteristicForService(
          'your-service-uuid',
          'your-characteristic-uuid',
          (error, characteristic) => {
            if (error) {
              console.warn("Error monitoring characteristic:", error);
            } else {
              const value = characteristic.value;
              const decodedValue = value ? Buffer.from(value, 'base64').toString('utf8') : '';
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
        await selectedDevice.disconnect();
        setIsConnected(false);
        setSelectedDevice(null);
      } catch (error) {
        console.warn("Error disconnecting from device:", error);
        Alert.alert("Error", "Failed to disconnect from the device");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Devices</Text>

      <TouchableOpacity onPress={startScan} style={styles.button}>
        <Text style={styles.buttonText}>{isScanning ? "Scanning..." : "Scan for Devices"}</Text>
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
