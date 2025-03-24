import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';
import { ScooterModule } from './scooter/scooter.module';
import { WalletModule } from './wallet/wallet.module';
import { VoucherModule } from './voucher/voucher.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
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
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   global: true,
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get('JWT_SECRET', 'your-secret-key'),
    //     signOptions: {
    //       expiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
    //     },
    //   }),
    // }),
    AuthModule,
    KafkaModule,
    ScooterModule,
    WalletModule,
    VoucherModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
