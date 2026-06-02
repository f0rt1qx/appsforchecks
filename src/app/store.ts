import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
}

export const useAppStore = create<AppState>()(() => ({
  isAuthenticated: false,
}));
