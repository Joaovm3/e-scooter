#ifndef SCOOTER_EVENTS_H
#define SCOOTER_EVENTS_H

#include <stdint.h>
#include <stddef.h>

// Called for every event
// void onEvent(ev_t event);

void onJoin(void);
void onUplink(void);
void onDownlink(uint8_t *data, size_t size);

#endif