import { Wallet } from './wallet';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum Role {
  GUEST = 'guest',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface GoogleUser {
  id: string;
  email: string;
  token: string;
  name: string;
  picture: string;
  givenName: string;
  familyName: string;
}

export interface User extends GoogleUser {
  status: UserStatus;
  roles: Role;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  wallet: Wallet;
  walletId: string;
}

export interface AuthContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setAndStoreUser: (userData: User) => Promise<void>;
  isLoading: boolean;
  signIn: () => Promise<GoogleUser>;
  signOut: () => Promise<void>;
}
