import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'h213iuh12askjdh',
    description: 'id do google do usuário',
  })
  @IsNotEmpty()
  googleId: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'email do usuário do google',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'João Bonitão',
    description: 'nome do usuário do google',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '',
    description: 'foto do usuário do google',
  })
  @IsNotEmpty()
  picture: string;

  @ApiProperty({
    example: '321u3h12u3h123u12h312hsa',
    description: 'token do google',
  })
  @IsNotEmpty()
  token: string;
}
