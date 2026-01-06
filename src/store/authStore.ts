import { create } from 'zustand';

interface StoreState {
    isLoggedIn: boolean;
    username: string | null;
    storeLogin: (username: string) => void;
    storeLogout: () => void;
}

export const useAuthStore = create<StoreState>((set) => ({
    isLoggedIn: false,
    username: null,
    storeLogin: (username: string) => set({ isLoggedIn: true, username }),
    storeLogout: () => set({ isLoggedIn: false, username: null })
}));