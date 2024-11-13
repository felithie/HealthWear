import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

export const manager = new BleManager() 

export const requestBluetoothPermission = async () => {
    console.log("Requesting permission");

    if (Platform.OS === 'ios') {
        return true;
    }

    if (Platform.OS === 'android') {
        const apiLevel = parseInt(Platform.Version.toString(), 10);

        try {
            if (apiLevel < 31) {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const result = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, // Add this if needed
                ]);

                return (
                    result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
                    result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
                    result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
                );
            }
        } catch (err) {
            console.warn("Permission request error:", err);
            return false;
        }
    }

    console.log('Permissions have not been granted');
    return false;
};

export function scanAndConnect() {
    manager.startDeviceScan(null, null, (error: any, device: any) => {
     
      if (error) {
        return
      }
      if(device?.localName?.includes("FabiansLinux" || "Pixel") ) {
        console.log(device)
        device.connect()
      }
 
      if(device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        manager.stopDeviceScan()
      }
    })
  }
