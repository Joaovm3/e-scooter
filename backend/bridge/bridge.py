import threading
import mqtt_to_kafka
import kafka_to_mqtt

# TODO: Use the same id everywhere...
# DEBUG_DEVICE_ID = 'fadffd21-6e7a-401b-99a5-c1f2792742f3' 

mqtt_to_kafka_thread = threading.Thread(
    target=mqtt_to_kafka.bridge
)
kafka_to_mqtt_thread = threading.Thread(
    target=kafka_to_mqtt.bridge
)

mqtt_to_kafka_thread.start()
kafka_to_mqtt_thread.start()

mqtt_to_kafka_thread.join()
kafka_to_mqtt_thread.join()

