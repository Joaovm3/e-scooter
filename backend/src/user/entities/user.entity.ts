import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  picture: string;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true }) // Criar carteira automaticamente
  wallet: Wallet;
}
