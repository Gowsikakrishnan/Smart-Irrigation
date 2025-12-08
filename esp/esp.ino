#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

// ---------- PIN DEFINITIONS ----------
#define DHTPIN D2
#define DHTTYPE DHT11
#define SOIL_PIN A0
#define RAIN_PIN D1
#define PUMP_TRIGGER_PIN D5   // <-- to Arduino D8

// ---------- DHT SENSOR ----------
DHT dht(DHTPIN, DHTTYPE);

// ---------- WIFI DETAILS ----------
const char* ssid = "yourSSID";
const char* password = "yourPASS";

// ---------- BACKEND URL ----------
String backendURL = "http://YOUR_PC_IP:3000/api/sensors/data";

// ---------- TIMING ----------
unsigned long lastSend = 0;
unsigned long sendInterval = 2UL * 60UL * 60UL * 1000UL; // 2 hours
unsigned long lastPumpTime = 0;
unsigned long pumpCooldown = 1UL * 60UL * 60UL * 1000UL; // 1 hour

void setup() {
  Serial.begin(115200);

  dht.begin();
  pinMode(RAIN_PIN, INPUT);
  pinMode(PUMP_TRIGGER_PIN, OUTPUT);
  digitalWrite(PUMP_TRIGGER_PIN, HIGH); // idle HIGH (no trigger)

  lastSend = -sendInterval;
  lastPumpTime = -pumpCooldown;

  Serial.println("Connecting WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
}

void loop() {
  unsigned long now = millis();

  if (now - lastSend >= sendInterval) {
    lastSend = now;
    readAndProcess();
  }
}

void readAndProcess() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int soil = analogRead(SOIL_PIN);
  int rain = digitalRead(RAIN_PIN);

  Serial.println("\n---- SENSOR DATA ----");
  Serial.println("Temperature: " + String(temperature));
  Serial.println("Humidity: " + String(humidity));
  Serial.println("Soil Moisture: " + String(soil));
  Serial.println("Rain: " + String(rain));

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT ERROR → NaN readings → Skipping upload");
    return;
  }

  unsigned long now = millis();

  // Soil dry: high value (your sensor: ~1024 dry)
  if (soil > 800) {
    Serial.println("SOIL IS DRY!");

    if (now - lastPumpTime >= pumpCooldown) {
      Serial.println("Triggering PUMP to Arduino (digital pulse)...");
      // Send a LOW pulse to Arduino D8
      digitalWrite(PUMP_TRIGGER_PIN, LOW);
      delay(200);  // 200 ms pulse
      digitalWrite(PUMP_TRIGGER_PIN, HIGH);

      lastPumpTime = now;
    } else {
      unsigned long minsLeft = (pumpCooldown - (now - lastPumpTime)) / 60000;
      Serial.println("Pump cooldown active. Next pump in " + String(minsLeft) + " minutes.");
    }
  } else {
    Serial.println("Soil is wet → no pump trigger");
  }

  // --- Send to backend ---
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    if (http.begin(client, backendURL)) {
      http.addHeader("Content-Type", "application/json");

      String jsonData = "{\"temperature\":" + String(temperature) +
                        ",\"humidity\":" + String(humidity) +
                        ",\"soilMoisture\":" + String(soil) +
                        ",\"rainLevel\":" + String(rain) + "}";

      int code = http.POST(jsonData);
      Serial.println("POST Response Code: " + String(code));
      if (code > 0) Serial.println(http.getString());
      http.end();
    } else {
      Serial.println("HTTP begin failed!");
    }
  }
}

