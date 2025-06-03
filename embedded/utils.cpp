#include <lmic.h>
#include <TinyGPS++.h>
// #include <HardwareSerial.h>

#include "utils.hpp"

static osjob_t sendJob;
static uint8_t *jobArgData;
static size_t jobArgSize;

static void doSendJob(osjob_t *job) {
  if (!(LMIC.opmode & OP_TXRXPEND)) {
      // Envio confirmado (último argumento = 1)
      LMIC_setTxData2(1, jobArgData, jobArgSize, 1);
  }
}

void scheduleUplink(uint8_t *data, size_t size, uint32_t delay) {
  // Cancel the last callback to not fuck up the state...
  os_clearCallback(&sendJob);

  jobArgData = data;
  jobArgSize = size;
  os_setTimedCallback(&sendJob, os_getTime() + sec2osticks(delay), doSendJob);
}

TinyGPSPlus gps;
HardwareSerial GPS_Serial(1); // Use Serial1 for GPS

void setupGps(void) {
  Serial.println("Starting GPS...");
  GPS_Serial.begin(9600, SERIAL_8N1, 12, 15); // 34, 12);
  while(!GPS_Serial);
  delay(2000);
}

bool getGpsLocation(double *latitude, double *longitude) {
  unsigned long start = millis();
  const unsigned long timeout = 5000; // Timeout after 5 seconds

  while (millis() - start < timeout) {
    while (GPS_Serial.available()) {
      char c = GPS_Serial.read();
      gps.encode(c);

      if (gps.location.isUpdated()) {
        *latitude = gps.location.lat();
        *longitude = gps.location.lng();
        return true;
      }
    }
  }

  return false;
}

void setupRelayPin(void) {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
}

void turnOnRelay(void) {
  digitalWrite(RELAY_PIN, LOW);
  delay(2000);
  digitalWrite(RELAY_PIN, HIGH);
  delay(1000);
  
  digitalWrite(RELAY_PIN, LOW);
  delay(200);
  digitalWrite(RELAY_PIN, HIGH);
  delay(200);
  digitalWrite(RELAY_PIN, LOW);
  delay(200);
  digitalWrite(RELAY_PIN, HIGH);
}

void turnOffRelay(void) {
  digitalWrite(RELAY_PIN, LOW);
  delay(2000);
  digitalWrite(RELAY_PIN, HIGH);
}
