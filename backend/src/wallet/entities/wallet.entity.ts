import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' }) // Relacionamento 1 para 1 com User
  @JoinColumn()
  user: User;

  @Column({ type: 'decimal', default: 100 })
  balance: number;

  @BeforeInsert()
  setInitialBalance() {
    if (!this.balance) {
      this.balance = 100; // Define o saldo inicial automaticamente
    }
  }
}
