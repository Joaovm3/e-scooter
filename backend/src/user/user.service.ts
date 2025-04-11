import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      ...user,
      walletId: user.wallet?.id,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto?.email}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOrCreateUser(userDto: CreateUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOne({
      where: { email: userDto.email },
      relations: ['wallet'],
    });

    if (!user) {
      user = this.userRepository.create({
        ...userDto,
        wallet: new Wallet(),
      });
      await this.userRepository.save(user);
    }

    return {
      ...user,
      walletId: user.wallet.id,
    };
  }
}
