#include <lmic.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>

#include "utils.hpp"

// TODO: ... Arduino devs are so shit...
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

HardwareSerial GPS_Serial(1); // User Serial1 for GPS
TinyGPSPlus gps;

void setupGps(void) {
  GPS_Serial.begin(9600, SERIAL_8N1, 34, 12);
}

bool getGpsLocation(double *latitude, double *longitude) {
  unsigned long start = millis();
  const unsigned long timeout = 5000; // Timeout after 5 seconds

  while (millis() - start < timeout) {
    while (GPS_Serial.available() > 0) {
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
  digitalWrite(RELAY_PIN, LOW);
}

void turnOnRelay(void) {
  digitalWrite(RELAY_PIN, HIGH);
}

void turnOffRelay(void) {
  digitalWrite(RELAY_PIN, LOW);
}
