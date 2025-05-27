#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>

#include "utils.hpp"
#include "events.hpp"

// OTAA credentials (substitua pelos da sua aplicação)
static const u1_t PROGMEM DEVEUI[8]  = { 
  0xFF, 0xFF, 0x98, 0xCD, 0xAC, 0xF0, 0xC0, 0x68 
};

static const u1_t PROGMEM APPEUI[8]  = { 
  0xCB, 0x26, 0x96, 0x0C, 0x77, 0x19, 0xA6, 0x90 
};

static const u1_t PROGMEM APPKEY[16] = { 
  0x61, 0xCE, 0x2F, 0x8A, 0x34, 0xB9, 0xF8, 0xE7, 
  0x20, 0x29, 0xF2, 0xF3, 0xFC, 0xB4, 0xEC, 0xC6 
};

// Funções exigidas pelo LMIC
void os_getArtEui(u1_t* buf)  { memcpy_P(buf, APPEUI, 8); }
void os_getDevEui(u1_t* buf)  { memcpy_P(buf, DEVEUI, 8); }
void os_getDevKey(u1_t* buf)  { memcpy_P(buf, APPKEY, 16); }

// Pinos LoRa (ajuste conforme seu módulo)
#define CS_PIN    18
#define RST_PIN   14
#define DIO0_PIN  26
#define DIO1_PIN  33
#define DIO2_PIN  32

const lmic_pinmap lmic_pins = {
  .nss = CS_PIN,
  .rxtx = LMIC_UNUSED_PIN,
  .rst = RST_PIN,
  .dio = {DIO0_PIN, DIO1_PIN, DIO2_PIN}
};

void onEvent(ev_t ev) {
    Serial.print(F("Event: "));
    Serial.println(ev);

    // onEvent(ev);

    switch (ev) {
        case EV_JOINED:
            onJoin();
            LMIC_setLinkCheckMode(0); // desativa verificação automática (?)
            break;

        case EV_TXCOMPLETE:
            // TODO: Doing the onUplink after the onDownlink (which is counter intuitve)
            //       seams to have fixed the issue that some corrupted downlink data was
            //       being uplinked back for some reason and crashing the bridge.py
            if (LMIC.dataLen > 0) {
              onDownlink(LMIC.frame + LMIC.dataBeg, LMIC.dataLen);
            }
            onUplink();
            break;

        default:
            break;
    }
}

void setup() {
    Serial.begin(9600);
    while (!Serial); // aguarda monitor serial

    // Serial.println(F("Starting..."));

    // Inicialização LMIC
    os_init();
    LMIC_reset();

    setupGps();
    setupRelayPin();

    // Tolerância para clock impreciso
    // LMIC_setClockError(MAX_CLOCK_ERROR * 5 / 100);

    // Inicia OTAA join
    LMIC_startJoining();
}

void loop() {
    os_runloop_once(); // executa o loop do LMIC
}
