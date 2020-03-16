import React from 'react'
import { UserType } from './types';

type AuthContextProps = {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  user: UserType | null;
};

export const AuthContext = React.createContext<Partial<AuthContextProps>>({});