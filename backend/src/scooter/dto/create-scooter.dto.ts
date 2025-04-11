import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Geolocation } from './scooter.dto';
import { Type } from 'class-transformer';
import { ScooterStatus } from '../enums/scooter-status.enum';

class GeolocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class CreateScooterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ScooterStatus)
  status?: ScooterStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  batteryLevel: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => GeolocationDto)
  geolocation: Geolocation;
}
