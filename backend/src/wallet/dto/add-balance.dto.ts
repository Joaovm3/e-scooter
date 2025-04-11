import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { INITIAL_BALANCE } from '../entities/wallet.entity';

export class AddBalanceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(INITIAL_BALANCE)
  amount: number;
}
