import { NumberTransformer } from 'src/transformers/number.transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Geolocation } from '../dto/scooter.dto';
import { ScooterStatus } from '../enums/scooter-status.enum';

@Entity('scooter')
export class Scooter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: ScooterStatus.AVAILABLE })
  status: ScooterStatus;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumberTransformer(),
  })
  batteryLevel: number;

  @Column({ default: false })
  locked: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  geolocation: Geolocation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
