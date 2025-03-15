import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';
import { ScooterModule } from './scooter/scooter.module';
import { WalletModule } from './wallet/wallet.module';
import { VoucherModule } from './voucher/voucher.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('database')),
      }),
    }),
    KafkaModule,
    ScooterModule,
    WalletModule,
    VoucherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
