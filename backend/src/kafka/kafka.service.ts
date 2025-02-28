import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafkaInstance: Kafka;

  constructor(private readonly configService: ConfigService) {
    this.kafkaInstance = new Kafka({
      brokers: [this.configService.get('KAFKA_URL', 'localhost:9092')],
      clientId: this.configService.get('KAFKA_CLIENT_ID', 'e-scooter-service'),
      retry: {
        retries: 10, // Number of retries
        initialRetryTime: 300, // Initial retry time in ms
        maxRetryTime: 10000, // Maximum total retry time in ms
        factor: 0.2, // Exponential factor for backoff
      },
    });
  }

  getKafka() {
    return this.kafkaInstance;
  }

  getConsumer() {
    return this.kafkaInstance.consumer({ groupId: 'e-scooter-group' });
  }

  getProducer() {
    return this.kafkaInstance.producer();
  }
}
