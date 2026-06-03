import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS } from '@/data/mockData';
import { KEYS, storage } from '@/storage';
import { Role, User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Asigurăm conturile demo la prima rulare.
      const users = await storage.get<User[]>(KEYS.users, []);
      if (users.length === 0) {
        await storage.set(KEYS.users, DEMO_USERS);
      }
      const saved = await storage.get<User | null>(KEYS.currentUser, null);
      setUser(saved);
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string): Promise<string | null> {
    const users = await storage.get<User[]>(KEYS.users, DEMO_USERS);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return 'Email sau parolă incorecte.';
    setUser(found);
    await storage.set(KEYS.currentUser, found);
    return null;
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<string | null> {
    const users = await storage.get<User[]>(KEYS.users, DEMO_USERS);
    const exists = users.some(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (exists) return 'Există deja un cont cu acest email.';

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: data.role,
      // Frizerii noi nu sunt legați de un profil demo existent.
      barberId: data.role === 'barber' ? `b-${Date.now()}` : undefined,
    };
    const next = [...users, newUser];
    await storage.set(KEYS.users, next);
    setUser(newUser);
    await storage.set(KEYS.currentUser, newUser);
    return null;
  }

  async function logout() {
    setUser(null);
    await storage.remove(KEYS.currentUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth trebuie folosit în interiorul AuthProvider');
  return ctx;
}
