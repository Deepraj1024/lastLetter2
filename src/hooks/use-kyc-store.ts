import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandMMKVStorage } from "@/utils/storage";

interface KycState {
  clearKid: () => void;
  hasHydrated: boolean;
  kid: string | null;
  setKid: (kid: string) => void;
}

export const useKycStore = create<KycState>()(
  persist(
    (set) => ({
      clearKid: () => set({ kid: null }),
      hasHydrated: false,
      kid: null,
      setKid: (kid) => set({ kid }),
    }),
    {
      name: "kyc-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
      partialize: (state) => ({ kid: state.kid }),
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);

export const selectKid = (s: KycState) => s.kid;
export const selectHasHydrated = (s: KycState) => s.hasHydrated;
export const selectSetKid = (s: KycState) => s.setKid;
export const selectClearKid = (s: KycState) => s.clearKid;
