#include <Arduino.h>
#include <ArduinoJson.h>
#include <lmic.h>
#include <base64.hpp>
#include <stdlib.h>
#include <stddef.h>

#include "events.hpp"
#include "utils.hpp"

// namespace EmbeddedScooter {

// Intervalo de envio em segundos
const unsigned TX_INTERVAL = 5;

String status = "available";
String id = "fadffd21-6e7a-401b-99a5-c1f2792742f3"; // TODO: Hardcoded, will change with downlink

// Example:
// {
//    "id": "fadffd21-6e7a-401b-99a5-c1f2792742f3", 
//    "geolocation": {
//        "latitude": 47.0123091823,
//        "longitude": 12.1102940192
//    }
// }
void transmitPayload(void) {
  double latitude, longitude;
  bool gotLocation = getGpsLocation(&latitude, &longitude);

  // TODO: KEEP TRACK OF THE "status" AND SEND IT BACK ON THE UPLINK. THIS WAY
  //       BOTH THE DOWNLINK AND UPLINK PAYLOADS WILL HAVE THE SAME FIELDS!
  String payload = String("{ \"id\": \"" + id + "\", \"status\": \"") + 
    status + "\", \"batteryLevel\": 70, ";
  if (gotLocation) {
    Serial.println("Got location!!!");
    Serial.printf("Latitude: %lf, Longitude: %lf\n", latitude, longitude);

    payload += String("\"geolocation\": { \"latitude\": ") + 
      latitude + String(", \"longitude\": ") + longitude + String(" } }");
  } else {
    Serial.println("Failed to get GPS fix...");

    payload += "\"geolocation\": { \"latitude\": null, \"longitude\": null } }";
  }

  scheduleUplink((uint8_t *)payload.c_str(), payload.length(), TX_INTERVAL);
}

void onJoin(void) {
  Serial.println("Joined!");
  
  transmitPayload();
}

void onUplink(void) {
  Serial.println("Uplink!");
  
  transmitPayload();
}

// TODO: Test for "in_use" status json payload in hex 7B2022737461747573223A2022696E5F75736522207D
void onDownlink(uint8_t *data, size_t size) {
  Serial.println("Downlink!!!");

  String payload = String(data, size);
  Serial.println(payload);

  JsonDocument doc;
  deserializeJson(doc, payload);
  // Serial.println((const char *)doc["status"]);

  status = String(doc["status"]);
  id = String(doc["id"]); // TODO: Use EUI instead of UUID.........
  if (status == "in_use") {
    turnOnRelay();
    Serial.println("Turn relay on!");
  } else {
    turnOffRelay();
    Serial.println("Turn relay off!");
  }
}
