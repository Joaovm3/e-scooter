import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOrCreateUser(userDto: CreateUserDto) {
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

    return user;
  }
}
