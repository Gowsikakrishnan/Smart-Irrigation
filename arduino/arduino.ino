#define RELAY_PIN 7          // Relay IN pin
#define PUMP_TRIGGER_PIN 8   // From ESP D5

const unsigned long PUMP_DURATION_MS = 20000; // 20 sec

bool pumpRunning = false;
unsigned long pumpStartTime = 0;

void setup() {
  Serial.begin(9600);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  // Pump OFF (active LOW)

  pinMode(PUMP_TRIGGER_PIN, INPUT_PULLUP); // idle HIGH, trigger on LOW

  Serial.println("Arduino Pump Controller Ready (digital trigger).");
}

void loop() {
  int triggerState = digitalRead(PUMP_TRIGGER_PIN);

  // When ESP pulls line LOW → trigger pump
  if (triggerState == LOW && !pumpRunning) {
    Serial.println("Trigger from ESP detected → starting pump.");
    startPump();
    // simple debounce so one pulse doesn't re-trigger
    delay(500);
  }

  // Auto-stop after 20 sec
  if (pumpRunning && millis() - pumpStartTime >= PUMP_DURATION_MS) {
    stopPump();
  }
}

void startPump() {
  pumpRunning = true;
  pumpStartTime = millis();
  digitalWrite(RELAY_PIN, LOW);  // ON
  Serial.println("Pump ON");
}

void stopPump() {
  pumpRunning = false;
  digitalWrite(RELAY_PIN, HIGH); // OFF
  Serial.println("Pump OFF");
}

