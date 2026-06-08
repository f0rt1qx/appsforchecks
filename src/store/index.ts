import { create } from 'zustand';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'user';
  createdAt: string;
};

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

const safeParseUser = (value: string | null): User | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    localStorage.removeItem('receipt-scanner-user');
    return null;
  }
};

const storedUser = safeParseUser(localStorage.getItem('receipt-scanner-user'));
const storedToken = localStorage.getItem('receipt-scanner-token');

export const MOCK_USER = {
  email: 'demo@receipt.app',
  password: 'demo123',
  name: 'Demo User',
} as const;

const createFakeToken = () => `fake-token-${Date.now()}-${crypto.randomUUID()}`;

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: Boolean(storedUser && storedToken),
  user: storedUser,
  token: storedToken,
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

    localStorage.setItem('receipt-scanner-user', JSON.stringify(user));
    localStorage.setItem('receipt-scanner-token', token);
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

    localStorage.setItem('receipt-scanner-user', JSON.stringify(user));
    localStorage.setItem('receipt-scanner-token', token);
    set({ isAuthenticated: true, user, token });

    return { success: true };
  },
  updateUser: (updates) => {
    let updatedUser: User | null = null;

    set((state) => {
      if (!state.user) {
        return state;
      }

      updatedUser = { ...state.user, ...updates };
      localStorage.setItem('receipt-scanner-user', JSON.stringify(updatedUser));

      return { user: updatedUser };
    });

    return { success: true, user: updatedUser };
  },
  logout: () => {
    localStorage.removeItem('receipt-scanner-user');
    localStorage.removeItem('receipt-scanner-token');
    set({ isAuthenticated: false, user: null, token: null });
  },
}));
