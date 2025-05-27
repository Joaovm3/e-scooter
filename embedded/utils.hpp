#ifndef SCOOTER_UTILS_H
#define SCOOTER_UTILS_H

#include <stdint.h>
#include <stddef.h>

#define RELAY_PIN 2

// Schedules a function to be called after the delay in seconds 
// void scheduleCallback(void *callback, uint32_t delay);

// Performs an uplink
// void sendUplink(uint8_t *data, size_t size);

void scheduleUplink(uint8_t *data, size_t size, uint32_t delay);

void setupGps(void);
bool getGpsLocation(double *latitude, double *longitude);

void setupRelayPin(void);
void turnOnRelay(void);
void turnOffRelay(void);

#endif
