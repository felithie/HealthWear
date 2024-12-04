import { BleManager } from 'react-native-ble-plx';

// Create a BleManager instance
const manager = new BleManager();

export const getBondedDevices = async () => {
  try {
    const devices = await manager.devices(); // Get paired devices
    console.log('Bonded devices:', devices);
    return Array.isArray(devices) ? devices : []; // Ensure devices is an array
  } catch (error) {
    console.error('Failed to get bonded devices', error);
    return []; // Return an empty array on failure
  }
};
