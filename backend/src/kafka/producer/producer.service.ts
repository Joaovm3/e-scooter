import { Injectable, OnModuleInit } from '@nestjs/common';
import { Producer, ProducerRecord } from 'kafkajs';
import { KafkaService } from '../kafka.service';

@Injectable()
export class ProducerService implements OnModuleInit {
  private readonly producer: Producer;

  constructor(private readonly kafkaService: KafkaService) {
    this.producer = this.kafkaService.getProducer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
