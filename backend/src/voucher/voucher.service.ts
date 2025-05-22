import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';
import { VoucherUsage } from './entities/voucher-usage.entity';
import { VoucherStatus } from './enums/status.enum';
import { WalletService } from 'src/wallet/wallet.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherUsage)
    private voucherUsageRepository: Repository<VoucherUsage>,
    private walletService: WalletService,
    private userService: UserService,
  ) {}

  async create(createVoucherDto: CreateVoucherDto) {
    try {
      const voucher = this.voucherRepository.create(createVoucherDto);
      return await this.voucherRepository.save(voucher);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('duplicate key')) {
          throw new ConflictException(
            'Código de voucher já existe, tente outro nome de código',
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.voucherRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} voucher`;
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }

  async useVoucher(userId: string, code: string): Promise<Voucher> {
    const activeUsage = await this.voucherUsageRepository.findOne({
      where: { userId, isActive: true },
    });

    if (activeUsage) {
      throw new ConflictException('User already has an active voucher');
    }

    const voucher = await this.validateVoucher(code);

    const user = await this.userService.findOne(userId);
    console.log('caiu', userId, user, activeUsage, voucher);

    // Create usage and update balance in parallel
    await Promise.all([
      this.voucherUsageRepository.save({
        voucherId: voucher.id,
        userId,
        isActive: false,
      }),

      this.walletService.updateBalance(user.walletId, voucher.amount),
    ]);

    voucher.usageCount += 1;
    return this.voucherRepository.save(voucher);
  }

  private async validateVoucher(code: string): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { code, status: VoucherStatus.ACTIVE },
    });
    console.log('validateVoucher', { voucher });
    if (!voucher) {
      throw new NotFoundException('Voucher não encontrado ou inativo');
    }

    if (voucher.usageCount >= voucher.usageLimit) {
      throw new ConflictException(
        'O Limite de uso do voucher já foi atingido!',
      );
    }

    if (voucher.expiredAt && voucher.expiredAt < new Date()) {
      voucher.status = VoucherStatus.EXPIRED;
      await this.voucherRepository.save(voucher);
      throw new ConflictException('Voucher expirado!');
    }

    return voucher;
  }

  async deactivateVoucher(userId: string): Promise<void> {
    const activeUsage = await this.voucherUsageRepository.findOne({
      where: { userId, isActive: true },
    });

    if (activeUsage) {
      activeUsage.isActive = false;
      await this.voucherUsageRepository.save(activeUsage);
    }
  }

  async getUsedVouchers(userId: string): Promise<VoucherUsage[]> {
    const usedVouchers = await this.voucherUsageRepository.find({
      where: { userId, isActive: false },
      relations: ['voucher'],
    });

    return usedVouchers;
  }
}
