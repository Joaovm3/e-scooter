import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  // ApiBearerAuth,
} from '@nestjs/swagger';
// import { GoogleLoginDto } from './dto/google.login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged in.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  googleLogin(@Body() body: CreateUserDto) {
    return this.authService.googleLogin(body);
  }

  // @Post('register')
  // @ApiOperation({ summary: 'Register a new user' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'User has been successfully registered.',
  // })
  // @ApiResponse({ status: 400, description: 'Invalid input data.' })
  // @ApiResponse({ status: 409, description: 'Email already exists.' })
  // async register(@Body() registerDto: RegisterDto) {
  //   return this.authService.register(registerDto);
  // }

  // @Post('login')
  // @ApiOperation({ summary: 'Login a user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'User has been successfully logged in.',
  // })
  // @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  // async login(@Body() loginDto: LoginDto) {
  //   return this.authService.login(loginDto);
  // }

  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get user profile' })
  // @ApiResponse({ status: 200, description: 'Return the user profile.' })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // async getProfile(@Request() req) {
  //   return this.authService.getUserProfile(req.user.sub);
  // }

  // @Post('logout')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Logout a user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'User has been successfully logged out.',
  // })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // async logout() {
  //   return { message: 'Successfully logged out' };
  // }
}
