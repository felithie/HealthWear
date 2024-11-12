#include "HX711.h"

// Pins für den HX711
const int DOUT_PIN = 4;  // Daten-Pin des HX711
const int SCK_PIN = 5;   // Takt-Pin des HX711

// HX711-Objekt erstellen
HX711 scale;

void setup() {
  Serial.begin(9600);  // Serielle Kommunikation starten
  
  // HX711 initialisieren
  scale.begin(DOUT_PIN, SCK_PIN);
  
  // Kalibrierung, Kalibrierungsfaktor muss angepasst werden
  scale.set_scale(2280.f); // Beispielwert
  scale.tare();            // Tarierung (Nullpunkt setzen)
  
  Serial.println("Dehnmessstreifen Datenaufzeichnung gestartet...");
}

void loop() {
  if (scale.is_ready()) {
    // Gewicht oder Spannung einlesen
    long reading = scale.get_units();
    Serial.print("Messwert: ");
    Serial.println(reading);
  } else {
    Serial.println("HX711 nicht bereit");
  }

  delay(6000); // Wartezeit zwischen den Messungen
}
