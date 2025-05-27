# Mosquitto setup in RAK7268C

## Starting the broker
```sh
$ sudo docker-compose up --build
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
