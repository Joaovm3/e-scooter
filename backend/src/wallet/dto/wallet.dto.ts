import { Exclude } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class WalletDto {
  id: string;

  @IsNumber()
  balance: number;

  @Exclude()
  @IsNumber()
  minimumBalance: number;
}
