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
  const [maxValue, setMaxValue]: any = useState(82.5);  // State to hold received data

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

  const saveDeviceToStorage = async (pressure: string) => {
    try {
     
      await AsyncStorage.setItem("pressure", pressure);
    } catch (error) {
      console.warn("Error saving device:", error);
    }
  };
  
  let subscription: any = null;

  const handleConnectDevice = async (device: Device) => {
  if (device) {
    try {
      await device.connect();
      setSelectedDevice(device);
      setIsConnected(true);

      await device.discoverAllServicesAndCharacteristics();

      const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
      const characteristicUUID = '00002a37-0000-1000-8000-00805f9b34fb';

      let lastProcessedTime = Date.now();
      let previousData = null;

      subscription = device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.warn("Error monitoring characteristic:", error);
            return;
          }

          const now = Date.now();
          const value = characteristic.value;
          const decodedValue = value ? atob(value) : '';

          // Throttle to 200 ms
          if (now - lastProcessedTime >= 200 && decodedValue !== previousData) {
            lastProcessedTime = now;
            previousData = decodedValue;

            saveDeviceToStorage(decodedValue);
            setReceivedData(decodedValue);
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
    <View style={{ marginTop: 40 }}/>
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
      <View style={styles.realtimeOverviewContainer}>
        <View style={[styles.realtimeCircle, { backgroundColor: "grey" }]} />
        <View style={styles.realtimeTextContainer}>
          <Text style={styles.realtimeText}>How you are doing:</Text>
          <Text style={styles.realtimePercent}>{receivedData === null ? "No device connected" : (100 - Number(receivedData) / maxValue * 100).toFixed(1) + "%"}</Text>
          
          <TouchableOpacity onPress={() => setMaxValue(Number(receivedData))} style={styles.button}>
            <Text style={styles.buttonText}>Calibrate</Text>
          </TouchableOpacity>
        </View>
      </View>


      {isConnected && selectedDevice && (
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionStatus}>Connected to {selectedDevice.name}</Text>
          {receivedData ? (
            <Text style={styles.receivedData}>Received Data: {receivedData}</Text>
          ) : (
            <Text style={styles.receivedData}>Waiting for data...</Text>
          )}

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
  realtimeOverviewContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },
  realtimeTextContainer: {
    marginLeft: 20
  },
  realtimeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  realtimeText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  realtimePercent: {
    fontSize: 25,
    fontWeight: "bold"
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
