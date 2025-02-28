import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
import { ScooterModule } from './scooter/scooter.module';
import { VoucherModule } from './voucher/voucher.module';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST', 'localhost'),
    //     port: configService.get<number>('DB_PORT', 5432),
    //     username: configService.get('DB_USERNAME', 'postgres'),
    //     password: configService.get('DB_PASSWORD', 'postgres'),
    //     database: configService.get('DB_DATABASE', 'escooter'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: configService.get<boolean>('DB_SYNC', true),
    //     logging: configService.get<boolean>('DB_LOGGING', false),
    //   }),
    // }),
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
    // AuthModule,
    ScooterModule,
    VoucherModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
