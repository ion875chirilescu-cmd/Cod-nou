import AsyncStorage from '@react-native-async-storage/async-storage';

/** Wrapper simplu peste AsyncStorage pentru obiecte JSON. */
export const storage = {
  async get<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  async set(key: string, value: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignorăm erorile de scriere în demo
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // noop
    }
  },
};

export const KEYS = {
  users: 'sb:users',
  currentUser: 'sb:currentUser',
  appointments: 'sb:appointments',
};
