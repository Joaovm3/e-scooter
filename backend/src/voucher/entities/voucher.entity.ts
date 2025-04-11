import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VoucherStatus } from '../enums/status.enum';
import { NumberTransformer } from 'src/transformers/number.transformer';

@Entity('voucher')
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumberTransformer(),
  })
  amount: number;

  @Column({ default: VoucherStatus.ACTIVE })
  status: VoucherStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiredAt: Date | null;

  @Column()
  usageLimit: number;

  @Column({ default: 0 })
  usageCount: number;
}
