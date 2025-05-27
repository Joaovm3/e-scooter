import base64
import json
import paho.mqtt.client as mqtt
from kafka import KafkaProducer

def DEBUG_log(prefix, msg):
    with open('log.txt', 'a') as f: 
        f.write(f'{prefix}: {msg}\n')

# TODO: Get these by env vars trough docker config
MQTT_BROKER = 'mosquitto'
MQTT_PORT = 1883
# MQTT_TOPIC = 'application/2/device/68c0f0accd98ffff/rx' # '#'
MQTT_TOPIC = 'application/2/device/+/rx' # '#'

KAFKA_BROKER = 'kafka:9092'
KAFKA_TOPIC = 'track-scooter'

# TODO: Use the same id everywhere...
# DEBUG_DEVICE_ID = 'fadffd21-6e7a-401b-99a5-c1f2792742f3' 

def bridge():
    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BROKER],
        value_serializer=lambda v: json.dumps(v).encode()
    )

    def on_connect(client, userdata, flags, rc):
        client.subscribe(MQTT_TOPIC)

    def on_message(client, userdata, msg):
        raw_payload = msg.payload.decode('utf-8')
        payload = json.loads(raw_payload)

        try:
            raw_data = base64.b64decode(payload['data'])
            data = json.loads(raw_data.decode('utf-8'))

            producer.send(KAFKA_TOPIC, data)
            producer.flush()
        except Exception as e:
            # TODO: Figure out why when I make a downlink via Kafka
            #       the data is getting here corrupted!!!
            # TODO: Aparently handling the downlink first on the
            #       embedded code (before triggering another uplink)
            #       seams to have solved the issue. It is probably
            #       related to some internal magic buffer of lmic
            #       being changed or overwritten while I was doing
            #       the other way around
            DEBUG_log('error', raw_data)
            DEBUG_log('--------', '--------')
            DEBUG_log('error1', payload['data'])
            DEBUG_log('--------', '--------')
            DEBUG_log('error2', raw_payload)

        # Add id
        # eui = payload['devEUI']
        # data['id'] = DEBUG_DEVICE_ID

        # DEBUG_log(json.dumps(data))

    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_forever()

