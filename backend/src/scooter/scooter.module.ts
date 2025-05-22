import { Module } from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { ScooterController } from './scooter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scooter } from './entities/scooter.entity';
import { ScooterTrackingGateway } from './gateways/scooter-tracking.gateway';

import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter]), WalletModule],
  controllers: [ScooterController],
  providers: [ScooterService, ScooterTrackingGateway],
  exports: [ScooterService, ScooterTrackingGateway],
})
export class ScooterModule {}
