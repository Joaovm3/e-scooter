import { Max, Min } from 'class-validator';

const LIMIT_AMOUNT = 100;

export class addBalanceDto {
  @Min(LIMIT_AMOUNT)
  @Max(LIMIT_AMOUNT)
  amount: number;
}
