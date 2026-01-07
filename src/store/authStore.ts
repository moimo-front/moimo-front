import { create } from 'zustand';

interface StoreState {
    isLoggedIn: boolean;
    nickname: string | null;
    accessToken: string | null;
    storeLogin: (nickname: string, accessToken: string) => void;
    storeLogout: () => void;
    setAccessToken: (token: string) => void;
}

export const useAuthStore = create<StoreState>((set) => ({
    isLoggedIn: false,
    nickname: null,
    accessToken: null,
    storeLogin: (nickname: string, accessToken: string) => set({ isLoggedIn: true, nickname, accessToken }),
    storeLogout: () => set({ isLoggedIn: false, nickname: null, accessToken: null }),
    setAccessToken: (accessToken: string) => {
        set(() => ({ accessToken }));
    }
}));