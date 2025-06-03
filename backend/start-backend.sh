#!/bin/bash

cp .env.sample .env
sudo docker-compose up -d --build

# This will ensure kafka topics have assigned leaders (kinda hacky, but works)
sudo docker exec kafka kafka-topics --describe --unavailable-partitions --bootstrap-server localhost:9092

# This will ensure even further...
echo "=========================================================="
echo "Waiting a little bit (60 secs) for Kafka to settle down..."
echo "Sorry for the inconvenience! :)"
echo "=========================================================="
sleep 60

npm install && npm run start:dev

# bash bridge/wait-for-it.sh -t 0 localhost:9092 -- sudo docker exec kafka kafka-topics --describe --unavailable-partitions --bootstrap-server localhost:9092
# bash bridge/wait-for-it.sh -t 0 localhost:9092 -- npm install && npm run start:dev
