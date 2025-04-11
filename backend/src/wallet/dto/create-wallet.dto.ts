import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  userId: string;
}
