#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include "HX711.h"

// Pins for BLE and LED
const int ledPin = 6;             // GPIO 6 for the LED
const int pressureSensorPin = 4;  // Analog pin for the pressure sensor

// Pins for the HX711
const int DOUT_PIN = 7;  // Data pin for HX711
const int SCK_PIN = 5;   // Clock pin for HX711

// BLE objects
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

// Variables to store sensor data
float sensorValue = 0;
float voltage = 0;
float pressure = 0;
HX711 scale;

// BLE UUIDs
#define SERVICE_UUID        "180F"  // Example: Battery Service UUID
#define CHARACTERISTIC_UUID "2A37"  // Example characteristic UUID

// Server callback to handle connection and disconnection events
class MyServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        deviceConnected = true;
        Serial.println("Client connected.");
    }

    void onDisconnect(BLEServer* pServer) {
        deviceConnected = false;
        Serial.println("Client disconnected. Restarting advertisement...");
        // Restart advertising so the device can be discovered again
        pServer->startAdvertising();
    }
};

void setup() {
    // Start Serial communication
    Serial.begin(115200);
    analogReadResolution(12);  // Set ADC resolution to 12 bits

    // Set LED pin as output
    pinMode(ledPin, OUTPUT);

    // Initialize HX711
    scale.begin(DOUT_PIN, SCK_PIN);
    scale.set_scale(2280.f);  // Adjust calibration factor as needed
    scale.tare();
    Serial.println("HX711 initialized.");

    // Initialize BLE
    BLEDevice::init("Team4");
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());  // Set connection callbacks

    // Create BLE service and characteristic
    BLEService* pService = pServer->createService(BLEUUID((uint16_t)0x180F));
    pCharacteristic = pService->createCharacteristic(
        BLEUUID((uint16_t)0x2A37),
        BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
    );

    // Add descriptor and start service
    pCharacteristic->addDescriptor(new BLE2902());
    pService->start();

    // Start advertising
    pServer->getAdvertising()->start();
    Serial.println("BLE started. Waiting for connections...");
}

void loop() {
    if (deviceConnected) {
        // --- Pressure sensor data ---
        sensorValue = analogRead(pressureSensorPin);
        voltage = sensorValue * (3.3 / 4095.0);  // Convert to voltage
        pressure = (voltage - 0.5) * (100.0 / 4.0);

        // --- HX711 data ---
        long weight = 0;
        if (scale.is_ready()) {
            weight = scale.get_units();
        } else {
            Serial.println("HX711 not ready");
        }

        // Format data as a single message
        char message[100];
        sprintf(message, "Pressure: %.2f bar, Weight: %ld units", pressure, weight);

        // Send data over BLE
        pCharacteristic->setValue(message);
        pCharacteristic->notify();

        // Log data to serial for PC logging
        Serial.println(message);  // This line logs to the PC over USB
    }

    // --- Blink LED ---
    digitalWrite(ledPin, HIGH);
    delay(500);
    digitalWrite(ledPin, LOW);
    delay(2000);  // Wait before next reading
}
