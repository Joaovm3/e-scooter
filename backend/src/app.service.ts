import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProducerService } from './kafka/producer/producer.service';
import { ConsumerService } from './kafka/consumer/consumer.service';
import { ScooterService } from './scooter/scooter.service';
import { TrackingScooter } from './scooter/dto/scooter.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private readonly scooterService: ScooterService,
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

  async getKafkaScootersPosition() {
    await this.consumerService.consume(
      { topics: ['track-scooter'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const scooterData = JSON.parse(
              message?.value?.toString() || '',
            ) as TrackingScooter;

            if (!scooterData?.id) {
              console.error('Scooter não possui id', scooterData);
              return;
            }

            await this.scooterService.emitScooterPosition(scooterData);
          } catch (error) {
            console.error('Error processing Kafka message:', error);
          }
        },
      },
    );
  }

  async onModuleInit() {
    await this.getKafkaScootersPosition();
  }
}
