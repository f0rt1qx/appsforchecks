import { create } from 'zustand';
import { mockDbService } from '@/services/mockDbService';
import type { User } from '@/services/mockDbService';

export type { User } from '@/services/mockDbService';

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  name: string;
  email: string;
};

type LoginResult =
  | { success: true }
  | { success: false; error: string };

type UpdateUserResult = {
  success: true;
  user: User | null;
};

type AppState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (input: LoginInput) => LoginResult;
  register: (input: RegisterInput) => { success: true };
  updateUser: (updates: Partial<Pick<User, 'name' | 'email'>>) => UpdateUserResult;
  logout: () => void;
};

const storedSession = mockDbService.getSession();

export const MOCK_USER = {
  email: 'demo@receipt.app',
  password: 'demo123',
  name: 'Demo User',
} as const;

const createFakeToken = () => `fake-token-${Date.now()}-${crypto.randomUUID()}`;

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: Boolean(storedSession),
  user: storedSession?.user ?? null,
  token: storedSession?.token ?? null,
  login: ({ email, password }) => {
    const isValidUser = email === MOCK_USER.email && password === MOCK_USER.password;

    if (!isValidUser) {
      return {
        success: false,
        error: 'Неверный email или пароль',
      };
    }

    const token = createFakeToken();
    const user: User = {
      id: 'mock-user',
      email: MOCK_USER.email,
      name: MOCK_USER.name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    mockDbService.saveSession({ user, token });
    set({ isAuthenticated: true, user, token });

    return { success: true };
  },
  register: ({ name, email }) => {
    const token = createFakeToken();
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    mockDbService.saveSession({ user, token });
    set({ isAuthenticated: true, user, token });

    return { success: true };
  },
  updateUser: (updates) => {
    let updatedUser: User | null = null;

    set((state) => {
      if (!state.user) {
        return state;
      }

      updatedUser = mockDbService.updateUser(updates);

      return { user: updatedUser };
    });

    return { success: true, user: updatedUser };
  },
  logout: () => {
    mockDbService.clearSession();
    set({ isAuthenticated: false, user: null, token: null });
  },
}));
