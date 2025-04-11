import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Voucher } from './voucher.entity';

@Entity('voucher_usage')
export class VoucherUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Voucher)
  @JoinColumn()
  voucher: Voucher;

  @Column()
  voucherId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  usedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
