import { NumberTransformer } from 'src/transformers/number.transformer';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const MINIMUM_BALANCE = -100;
export const INITIAL_BALANCE = Math.abs(MINIMUM_BALANCE);

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' }) // Relacionamento 1 para 1 com User
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'decimal',
    precision: 10, // Total number of digits
    scale: 2, // Digits after decimal point
    transformer: new NumberTransformer(),
    default: INITIAL_BALANCE,
  })
  balance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumberTransformer(),
    default: MINIMUM_BALANCE,
  })
  minimumBalance: number;

  @BeforeInsert()
  setInitialBalance() {
    if (!this.balance) {
      this.balance = INITIAL_BALANCE;
    }
  }
}
