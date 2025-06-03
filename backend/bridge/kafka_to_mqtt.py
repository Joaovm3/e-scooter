import base64
import json
import paho.mqtt.client as mqtt
from kafka import KafkaConsumer

from utils import DEBUG_log

# TODO: Get these by env vars trough docker config
MQTT_BROKER = 'mosquitto'
MQTT_PORT = 1883

KAFKA_BROKER = 'kafka:9092'
KAFKA_TOPIC = 'update-scooter'

# TODO: This is bad. We should just use the DEVEUI for everything...
# DEBUG_DEV_EUIS = { 'fadffd21-6e7a-401b-99a5-c1f2792742f3': '68c0f0accd98ffff' }

def build_payload(data):
    raw_bytes = json.dumps(data).encode('utf-8')
    encoded_raw_bytes = base64.b64encode(raw_bytes)

    raw_data = encoded_raw_bytes.decode('utf-8')

    return {
        "confirmed": False,
        "fPort": 2,
        "data": str(raw_data)
    }

def bridge():
    mqtt_client = mqtt.Client()
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()

    consumer = KafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=[KAFKA_BROKER],
        auto_offset_reset='latest',
        enable_auto_commit=True,
        group_id='bridge-group' # group_id='e-scooter-group' # ???
    )

    for msg in consumer:
        data = json.loads(msg.value)

        DEBUG_log('INFO', f'kafka_to_mqtt -> {data}')

        # Remove extra fields. TODO: Provisory!!!
        clean_data = {
            'id': data['id'],
            'status': data['status'],
            # 'geolocation': data['geolocation']
        }

        payload = build_payload(clean_data)

        # TODO: DEBUG!!! Just passing every traffic to the single endpoint
        #       that we have for now. Later we must set the dev_eui on the
        #       frontend when the admin register a new scooter, and it must
        #       be passed instead of the current UUID
        dev_eui = '68c0f0accd98ffff' # DEBUG_DEV_EUIS[data['id']]
        mqtt_topic = f'application/2/device/{dev_eui}/tx'

        mqtt_client.publish(mqtt_topic, json.dumps(payload))

