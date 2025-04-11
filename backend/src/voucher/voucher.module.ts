import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherUsage } from './entities/voucher-usage.entity';
import { Voucher } from './entities/voucher.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Voucher, VoucherUsage]),
    WalletModule,
    UserModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
