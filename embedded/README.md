# Mosquitto setup in RAK7268C

## Starting the broker
```sh
$ sudo docker-compose up --build
```

## Clear containers for fresh startup
```sh
$ sudo docker-compose down --rmi all -v
```

## Creating a new MQTT user
```sh
sudo docker exec -it mosquitto mosquitto_passwd -c /etc/mosquitto/passwd {{USERNAME}}
```

## Listening to all topics on the MQTT server
```sh
sudo docker exec -it mosquitto mosquitto_sub -t "#" -v
```

## Sending a downlink to device #68c0f0accd98ffff on application 2
```sh
sudo docker exec -it mosquitto mosquitto_pub -t "application/2/device/68c0f0accd98ffff/tx" -m '{"confirmed":false,"fPort":2,"data":"FFFFFF"}'
```

## Simulating a downlink via Kafka
```sh
sudo docker exec -it kafka kafka-console-producer --bootstrap-server kafka:9092 --topic update-scooter
```
> Then paste this on console: {"id":"fadffd21-6e7a-401b-99a5-c1f2792742f3","status":"in_use"}

## Consuming on Kafka
```sh
sudo docker exec kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic track-scooter --from-beginning
```

## Simulating an uplink from device on mosquitto
```sh
sudo docker exec -it mosquitto mosquitto_pub -t "application/2/device/68c0f0accd98ffff/rx" -m '{"data":"eyJpZCI6ImZhZGZmZDIxLTZlN2EtNDAxYi05OWE1LWMxZjI3OTI3NDJmMyIsInN0YXR1cyI6ImluX3VzZSIsImdlb2xvY2F0aW9uIjp7ImxhdGl0dWRlIjoxMC4wLCJsb25naXR1ZGUiOjEwLjB9fQ=="}'
```

# Backend

## Create a new scooter
```sh
curl -X POST http://localhost:3000/api/scooter -H "Content-Type: application/json" -d '{"name":"test-scooter-69","status":"available","batteryLevel":69,"locked":false,"geolocation":{"latitude":40.0,"longitude":40.0}}'
```

## List all scooters
```sh
curl http://localhost:3000/api/scooter
```

## POST a scooter unlock update
```sh
curl -X POST http://localhost:3000/api/scooter/SCOOTER_UUID/unlock -H "Content-Type: application/json" -d '{"userId":"user69"}'
```
> Remember to replace SCOOTER_UUID by a valid UUID from a scooter!
