import {
  Injectable,
  UnauthorizedException,
  // UnauthorizedException,
  // ConflictException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
// import { Repository } from 'typeorm';
// import { GoogleLoginDto } from './dto/google.login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
// import { User } from './entities/user.entity';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async registerGoogleUser(body: CreateUserDto) {
    const data = await this.userService.findOrCreateUser(body);
    return data;
  }

  async getUserProfile(id: string) {
    const user = await this.userService.findOne(id);
    return user;
  }
}
