import { VoucherStatus } from '../enums/status.enum';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsEnum(VoucherStatus)
  status?: VoucherStatus;

  // createdAt: Date;

  // updatedAt: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  expiredAt: Date | null;

  @IsNumber()
  usageLimit: number;

  @IsOptional()
  usageCount: number;
}
