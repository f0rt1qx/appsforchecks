import { create } from 'zustand';
import { storageService } from '@/services/storage.service';
import type { User } from '@/types/models';
import { createUser } from '@/utils/factories';

type AuthAccount = {
  user: User;
  password: string;
};

type AuthSession = {
  user: User;
  token: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = LoginInput & {
  name: string;
};

type AuthResult =
  | { success: true }
  | { success: false; error: string };

type UpdateUserResult = {
  success: true;
  user: User | null;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (input: LoginInput) => AuthResult;
  register: (input: RegisterInput) => AuthResult;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email'>>) => UpdateUserResult;
  logout: () => void;
};

const STORAGE_KEYS = {
  accounts: 'receipt-scanner-auth-accounts',
  session: 'receipt-scanner-auth-session',
} as const;

export const MOCK_USER = {
  email: 'demo@receipt.app',
  password: 'demo123',
  name: 'Demo User',
} as const;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const createToken = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `auth-token-${crypto.randomUUID()}`;
  }

  return `auth-token-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createDemoAccount = (): AuthAccount => ({
  user: {
    id: 'demo-user',
    email: MOCK_USER.email,
    name: MOCK_USER.name,
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  password: MOCK_USER.password,
});

const getAccounts = () => storageService.get<AuthAccount[]>(STORAGE_KEYS.accounts) ?? [];

const saveAccounts = (accounts: AuthAccount[]) => {
  storageService.set(STORAGE_KEYS.accounts, accounts);
};

const getAccountByEmail = (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  if (normalizedEmail === MOCK_USER.email) {
    return createDemoAccount();
  }

  return getAccounts().find((account) => account.user.email === normalizedEmail) ?? null;
};

const saveSession = (session: AuthSession) => {
  storageService.set(STORAGE_KEYS.session, session);
};

const storedSession = storageService.get<AuthSession>(STORAGE_KEYS.session);

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: Boolean(storedSession),
  user: storedSession?.user ?? null,
  token: storedSession?.token ?? null,

  login: ({ email, password }) => {
    const account = getAccountByEmail(email);

    if (!account || account.password !== password) {
      return {
        success: false,
        error: 'Неверный email или пароль',
      };
    }

    const token = createToken();
    saveSession({ user: account.user, token });
    set({ isAuthenticated: true, user: account.user, token });

    return { success: true };
  },

  register: ({ name, email, password }) => {
    const normalizedEmail = normalizeEmail(email);

    if (getAccountByEmail(normalizedEmail)) {
      return {
        success: false,
        error: 'Пользователь с таким email уже существует',
      };
    }

    const user = createUser({ name, email: normalizedEmail });
    const accounts = [...getAccounts(), { user, password }];
    const token = createToken();

    saveAccounts(accounts);
    saveSession({ user, token });
    set({ isAuthenticated: true, user, token });

    return { success: true };
  },

  updateUser: (updates) => {
    let updatedUser: User | null = null;

    set((state) => {
      if (!state.user) {
        return state;
      }

      const nextUser: User = {
        ...state.user,
        ...updates,
        email: updates.email ? normalizeEmail(updates.email) : state.user.email,
        name: updates.name ? updates.name.trim() : state.user.name,
      };

      updatedUser = nextUser;

      const token = state.token ?? createToken();
      saveSession({ user: nextUser, token });

      const accounts = getAccounts();
      const nextAccounts = accounts.map((account) =>
        account.user.id === state.user?.id ? { ...account, user: nextUser } : account
      );

      if (nextAccounts.some((account, index) => account !== accounts[index])) {
        saveAccounts(nextAccounts);
      }

      return { isAuthenticated: true, user: nextUser, token };
    });

    return { success: true, user: updatedUser };
  },

  logout: () => {
    storageService.remove(STORAGE_KEYS.session);
    set({ isAuthenticated: false, user: null, token: null });
  },
}));
