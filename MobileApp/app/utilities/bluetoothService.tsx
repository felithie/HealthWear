// bluetoothService.js
import BluetoothClassic from 'react-native-bluetooth-classic';

export const getBondedDevices = async () => {
  try {
    const devices = await BluetoothClassic.getBondedDevices();
    return devices; // Returns an array of bonded devices
  } catch (error) {
    throw new Error("Failed to get bonded devices");
  }
};

export const connectToDevice = async (deviceId) => {
  try {
    await BluetoothClassic.connectToDevice(deviceId); // Assuming `deviceId` uniquely identifies the device
  } catch (error) {
    throw new Error("Failed to connect to device");
  }
};

export const disconnectFromDevice = async (deviceId) => {
  try {
    await BluetoothClassic.disconnectFromDevice(deviceId);
  } catch (error) {
    throw new Error("Failed to disconnect from device");
  }
};
