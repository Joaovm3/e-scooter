import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';
import { KafkaService } from '../kafka.service';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumer: Consumer[] = [];

  constructor(private readonly kafkaService: KafkaService) {}

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafkaService.getConsumer();

    // try {
    //   await consumer.connect();
    //   await consumer.subscribe(topic);

    //   console.time('consumer-run');
    //   // TODO: verificar porquê a linha abaixo demorando tanto para startar
    //   await consumer.run({
    //     ...config,
    //     autoCommit: true,
    //     autoCommitInterval: 5000,
    //     eachBatchAutoResolve: true,
    //   });
    //   console.timeEnd('consumer-run');
    // } catch (error) {
    //   console.error('Failed to start consumer:', error);
    //   throw error;
    // }

    this.consumer.push(consumer);
  }

  async onApplicationShutdown() {
    await Promise.all(this.consumer.map((consumer) => consumer.disconnect()));
  }
}
