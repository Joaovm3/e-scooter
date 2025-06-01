#!/bin/bash

cp .env.sample .env
sudo docker-compose up -d --build
npm install && npm run start:dev
