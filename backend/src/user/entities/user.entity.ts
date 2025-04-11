import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BeforeInsert,
} from 'typeorm';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/status.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  googleId: string;

  @Column()
  token: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  picture: string;

  @Column({ default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column('simple-array', { default: [Role.GUEST] })
  roles: Role[];

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;

  @Column({ nullable: true })
  walletId: string;

  @BeforeInsert()
  setRolesBasedOnEmail() {
    const roles: Role[] = [Role.GUEST];

    if (this.email.endsWith('@sou.unijui.edu.br')) {
      roles.push(Role.STUDENT);
    }

    if (this.email.endsWith('@unijui.edu.br')) {
      roles.push(Role.ADMIN);
      this.isAdmin = true;
    }

    this.roles = roles;
  }

  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }
}
