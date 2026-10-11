/*
 * QuantumMed ESP32 Sensor Node
 * Streams patient vitals over WiFi to a QuantumMed server endpoint.
 * Adapt pins & sensor library to your hardware.
 */
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID     = "YOUR_WIFI";
const char* WIFI_PASSWORD = "YOUR_PASSWORD";
const char* SERVER_URL    = "http://192.168.1.100:8080/api/vitals";

const char* DEVICE_ID = "QM-001";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nConnected: " + WiFi.localIP().toString());
}

void loop() {
  // ── Replace with real sensor reads ──
  float heartRate   = 60 + random(0, 60);
  int   spo2        = 94 + random(0, 6);
  float temperature = 36.0 + (random(0, 200) / 100.0);
  int   bpSystolic  = 110 + random(0, 50);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["device_id"]     = DEVICE_ID;
    doc["patient_age"]   = 45;
    doc["heart_rate"]    = heartRate;
    doc["spo2"]          = spo2;
    doc["temperature"]   = temperature;
    doc["bp_systolic"]   = bpSystolic;
    doc["bp_diastolic"]  = 80;
    doc["timestamp"]     = "2025-01-01T00:00:00Z";

    String payload;
    serializeJson(doc, payload);

    int code = http.POST(payload);
    Serial.printf("POST → %d\n", code);
    http.end();
  }

  delay(5000); // 5 s interval
}