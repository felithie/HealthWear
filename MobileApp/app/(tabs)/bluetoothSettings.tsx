import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { atob } from 'react-native-quick-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';

let manager = new BleManager(); 

export default function BluetoothScreen() {
  const [scannedDevices, setScannedDevices]: any = useState([]);
  const [selectedDevice, setSelectedDevice]: any = useState(null);
  const [isConnected, setIsConnected]: any = useState(false);
  const [isScanning, setIsScanning]: any = useState(false);
  const [receivedData, setReceivedData]: any = useState("");  // State to hold received data

  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScannedDevices([]); // Clear previous scan results

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn("Error scanning for devices:", error);
        setIsScanning(false);
        return;
      }

      if (device && device.name === "Team4" && device.id) {
        // Check if the device is already in the list
        setScannedDevices((prevDevices: Device[]) => {
          const isDeviceInList = prevDevices.find(d => d.id === device.id);
          if (!isDeviceInList) {
            return [...prevDevices, device];
          } else {
            return prevDevices;
          }
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  // Save the characteristics and device to AsyncStorage
  const saveDeviceToStorage = async (pressure: string) => {
    try {
     
      await AsyncStorage.setItem("pressure", pressure);
    } catch (error) {
      console.warn("Error saving device:", error);
    }
  };
  

  // Connect to a selected device
  let subscription: any = null;

  const handleConnectDevice = async (device: Device) => {
    if (device) {
      try {
        await device.connect();
        setSelectedDevice(device);
        setIsConnected(true);

        // Discover all services and characteristics
        await device.discoverAllServicesAndCharacteristics();

        // Define the characteristics data (service and characteristic UUIDs)
        const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
        const characteristicUUID = '00002a37-0000-1000-8000-00805f9b34fb';

        
        // Subscribe to notifications on the characteristic
        subscription = device.monitorCharacteristicForService(
          serviceUUID,
          characteristicUUID,
          (error: any, characteristic: any) => {
            if (error) {
              console.warn("Error monitoring characteristic:", error);
            } else {
              const value = characteristic.value;
              const decodedValue = value ? atob(value) : '';
              saveDeviceToStorage(decodedValue)
              setReceivedData(decodedValue);  // Set the received data
            }
          }
        );
      } catch (error) {
        console.warn("Error connecting to device:", error);
      }
    }
  };

  const handleDisconnectDevice = async () => {
    if (selectedDevice) {
      try {
        console.log("Disconnecting from device:", selectedDevice);

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
        setIsConnected(false);
        setSelectedDevice(null);
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
        keyExtractor={(item: any, index: any) => `${item.id}-${index}`}  // Ensuring unique keys
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
