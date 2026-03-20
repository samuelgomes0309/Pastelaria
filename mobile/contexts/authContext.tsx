import { User } from '@/@types/user';
import { api } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loadingAuth: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  useEffect(() => {
    async function loadData() {
      await loadStorageUser();
    }
    loadData();
  }, []);
  async function loadStorageUser() {
    try {
      const token = await AsyncStorage.getItem('@appSG:token');
      const user = await AsyncStorage.getItem('@appSG:user');
      if (token && user) {
        setUser(JSON.parse(user));
      }
    } finally {
      setLoadingAuth(false);
    }
  }
  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/sessions', { email, password });
      const { token, ...user } = response.data;
      await AsyncStorage.setItem('@appSG:token', token);
      await AsyncStorage.setItem('@appSG:user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }
  async function signOut() {
    await AsyncStorage.removeItem('@appSG:token');
    await AsyncStorage.removeItem('@appSG:user');
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, signed: !!user, loadingAuth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Contexto de autenticação não encontrado');
  }
  return context;
}
