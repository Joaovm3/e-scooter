import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    example: 'h213iuh12askjdh',
    description: 'id do google do usuário',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'email do usuário do google',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '321u3h12u3h123u12h312hsa',
    description: 'token do google',
  })
  @IsNotEmpty()
  token: string;
}
