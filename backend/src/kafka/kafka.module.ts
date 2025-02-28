import { Global, Module } from '@nestjs/common';
import { ProducerService } from './producer/producer.service';
import { ConsumerService } from './consumer/consumer.service';
import { KafkaService } from './kafka.service';

@Global()
@Module({
  providers: [KafkaService, ProducerService, ConsumerService],
  exports: [KafkaService, ProducerService, ConsumerService],
})
export class KafkaModule {}
