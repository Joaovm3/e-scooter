import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProducerService } from './kafka/producer/producer.service';
import { ConsumerService } from './kafka/consumer/consumer.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testKafka() {
    const message = {
      timestamp: new Date().toISOString(),
      val: 'Hello KafkaJS world!',
    };

    await this.producerService.produce({
      topic: 'test-topic',
      messages: [
        { key: Math.random().toString(), value: JSON.stringify(message) },
      ],
    });

    return { success: true, message: 'topico enviado ao kafka' };
  }

  async onModuleInit() {
    // console.log('Iniciando o consumer');
    // await this.consumerService.consume(
    //   { topics: ['test-topic'] },
    //   {
    //     eachMessage: async ({ topic, partition, message }) => {
    //       console.log({
    //         topic: topic.toString(),
    //         partition: partition.toString(),
    //         value: message?.value?.toString(),
    //       });
    //     },
    //   },
    // );
  }
}
