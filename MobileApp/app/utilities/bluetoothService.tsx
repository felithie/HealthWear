import BluetoothClassic from 'react-native-bluetooth-classic';

export const sendMessage = async (message) => {
  try {
    console.log("Sending message:", message);
    await BluetoothClassic.writeToDevice(message);
    console.log(`Sent to server: ${message}`);
  } catch (error) {
    console.error("Failed to send message", error);
    throw new Error("Failed to send message");
  }
};

export const receiveMessage = async () => {
  try {
    console.log("Receiving message...");
    const receivedMessage = await BluetoothClassic.readFromDevice();
    console.log(`Received from server: ${receivedMessage}`);
    return receivedMessage;
  } catch (error) {
    console.error("Failed to receive message", error);
    throw new Error("Failed to receive message");
  }
};

export const getBondedDevices = async () => {
  try {
    const devices = await BluetoothClassic.getBondedDevices();
    console.log("Bonded devices:", devices);
    return devices; // Returns an array of bonded devices
  } catch (error) {
    console.error("Failed to get bonded devices", error);
    throw new Error("Failed to get bonded devices");
  }
};

export const connectToDevice = async (deviceId) => {
  try {
    console.log("Connecting to device with ID:", deviceId);
    await BluetoothClassic.connectToDevice(deviceId);
    console.log("Connected to device:", deviceId);
  } catch (error) {
    console.error("Failed to connect to device:", error);
    throw new Error("Failed to connect to device");
  }
};

export const disconnectFromDevice = async (deviceId) => {
  try {
    console.log("Disconnecting from device:", deviceId);
    await BluetoothClassic.disconnectFromDevice(deviceId);
    console.log("Disconnected from device:", deviceId);
  } catch (error) {
    console.error("Failed to disconnect from device:", error);
    throw new Error("Failed to disconnect from device");
  }
};