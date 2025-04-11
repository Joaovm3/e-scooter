import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  findAll() {
    return this.walletRepository.find();
  }

  async findOne(id: string) {
    const wallet = await this.walletRepository.findOne({ where: { id } });
    if (!wallet) throw new NotFoundException();

    return wallet;
  }

  async findByUserId(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { id: userId },
    });

    if (!wallet) throw new NotFoundException();

    return wallet;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  async addBalance(id: string, amount: number) {
    const wallet = await this.findOne(id);
    wallet.balance += amount;

    const updatedWallet = await this.walletRepository.save(wallet);
    console.log({ wallet, updatedWallet });
    return updatedWallet;
  }

  async withdraw(id: string, amount: number) {
    const wallet = await this.addBalance(id, amount);
    return wallet;
  }
}
