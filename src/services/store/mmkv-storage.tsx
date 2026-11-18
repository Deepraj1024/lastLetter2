import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const mmkv = createMMKV({ id: "chabi-storage" });

// zustand storage adapter with safe guards and null contract
export const mmkvStorage: StateStorage = {
  getItem: (name) => {
    try {
      const v = mmkv.getString(name);
      return v ?? null;
    } catch (e) {
      // graceful fallback; don't throw inside storage adapter
      console.warn("[mmkvStorage] getItem error", e);
      return null;
    }
  },
  removeItem: (name) => {
    try {
      // mmkv API uses remove / delete depending on version — keep the one you currently use
      // mmkv.remove(name);
      // if your version has delete:
      // mmkv.delete(name);
      mmkv.remove(name);
    } catch (e) {
      console.warn("[mmkvStorage] removeItem error", e);
    }
  },
  setItem: (name, value) => {
    try {
      mmkv.set(name, value);
    } catch (e) {
      console.warn("[mmkvStorage] setItem error", e);
    }
  },
};
