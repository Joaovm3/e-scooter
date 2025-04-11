import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/status.enum';

export class UserDto {
  id: string;
  googleId: string;
  token: string;
  email: string;
  name: string;
  picture: string;
  status: UserStatus;
  roles: Role[];
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  wallet?: Wallet;
  walletId: string;
}
