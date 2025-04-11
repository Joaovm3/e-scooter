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
import { AuthResponseDto } from './dto/auth-response.dto';

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
  async googleLogin(@Body() body: CreateUserDto): Promise<AuthResponseDto> {
    const data = await this.authService.registerGoogleUser(body);
    return data;
  }

  @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return the user profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Body() id: string) {
    return this.authService.getUserProfile(id);
  }
}
