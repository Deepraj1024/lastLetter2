import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const storage = createMMKV({ id: 'chabi-storage' });

const setToken = (token: string) => {
  try {
    storage.set('auth_token', token);
  } catch (error) {
    console.warn('[storage] setToken failed', error);
  }
};

const getToken = (): string | null => {
  try {
    return storage.getString('auth_token') ?? null;
  } catch (error) {
    console.warn('[storage] getToken failed', error);
    return null;
  }
};

const removeToken = () => {
  try {
    storage.remove('auth_token');
  } catch (error) {
    console.warn('[storage] removeToken failed', error);
  }
};

const setRefreshToken = (refreshToken: string) => {
  try {
    storage.set('refresh_token', refreshToken);
  } catch (error) {
    console.warn('[storage] setRefreshToken failed', error);
  }
};

const getRefreshToken = (): string | null => {
  try {
    return storage.getString('refresh_token') ?? null;
  } catch (error) {
    console.warn('[storage] getRefreshToken failed', error);
    return null;
  }
};

const clearSession = () => {
  try {
    storage.remove('auth_token');
    storage.remove('refresh_token');
  } catch (error) {
    console.warn('[storage] clearSession failed', error);
  }
};

const zustandMMKVStorage: StateStorage = {
  getItem: (name) => {
    try {
      return storage.getString(name) ?? null;
    } catch (error) {
      console.warn('[storage] getItem failed', error);
      return null;
    }
  },
  removeItem: (name) => {
    try {
      storage.remove(name);
    } catch (error) {
      console.warn('[storage] removeItem failed', error);
    }
  },
  setItem: (name, value) => {
    try {
      storage.set(name, value);
    } catch (error) {
      console.warn('[storage] setItem failed', error);
    }
  },
};

export {
  clearSession,
  getRefreshToken,
  getToken,
  removeToken,
  setRefreshToken,
  setToken,
  storage,
  zustandMMKVStorage,
};
