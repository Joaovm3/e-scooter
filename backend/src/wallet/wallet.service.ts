import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
      where: { userId },
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

  async updateBalance(walletId: string, amount: number) {
    const wallet = await this.findOne(walletId);
    const minimumBalance = wallet.minimumBalance;
    const newBalance = wallet.balance + amount;

    if (amount < 0 && newBalance < minimumBalance) {
      throw new UnprocessableEntityException(
        `Seu saldo não pode ficar abaixo de ${minimumBalance} tokens. Adicione mais saldo a carteira para continuar`,
      );
    }

    wallet.balance = newBalance;

    const updatedWallet = await this.walletRepository.save(wallet);
    console.log({ wallet, updatedWallet });
    return updatedWallet;
  }

  async withdraw(id: string, amount: number) {
    const wallet = await this.updateBalance(id, amount);
    return wallet;
  }
}
