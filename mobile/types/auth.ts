export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  givenName: string;
  familyName: string;
  token: string;
}

export interface AuthContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
}
