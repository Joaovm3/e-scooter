import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { INITIAL_BALANCE, MINIMUM_BALANCE } from '../entities/wallet.entity';

export class UpdateBalanceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(MINIMUM_BALANCE)
  @Max(INITIAL_BALANCE)
  amount: number;
}
