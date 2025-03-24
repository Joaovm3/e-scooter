import {
  Injectable,
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

  googleLogin(body: CreateUserDto) {
    const user = this.userService.findOrCreateUser(body);
    return { user };
  }
  // async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
  //   const { email, username, password } = registerDto;

  //   // Check if user already exists
  //   const existingUser = await this.usersRepository.findOne({
  //     where: { email },
  //   });
  //   if (existingUser) {
  //     throw new ConflictException('Email already exists');
  //   }

  //   // Create new user
  //   const user = this.usersRepository.create({
  //     email,
  //     username,
  //     password,
  //   });

  //   await this.usersRepository.save(user);

  //   // Generate token
  //   const payload = { sub: user.id, email: user.email };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  // async login(loginDto: LoginDto): Promise<{ access_token: string }> {
  //   const { email, password } = loginDto;

  //   // Find user
  //   const user = await this.usersRepository.findOne({ where: { email } });
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   // Validate password
  //   const isPasswordValid = await user.validatePassword(password);
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   // Generate token
  //   const payload = { sub: user.id, email: user.email };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  // async getUserProfile(userId: string): Promise<Omit<User, 'password'>> {
  //   const user = await this.usersRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const { password, ...result } = user;
  //   return result;
  // }
}
