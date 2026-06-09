export type User = {
  id: string;
  email: string;
  name: string;
  role: 'user';
  createdAt: string;
};

export type AuthSession = {
  user: User;
  token: string;
};

const STORAGE_KEYS = {
  user: 'receipt-scanner-user',
  token: 'receipt-scanner-token',
} as const;

const readJson = <T>(key: string): T | null => {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const writeJson = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const mockDbService = {
  getSession: (): AuthSession | null => {
    const user = readJson<User>(STORAGE_KEYS.user);
    const token = localStorage.getItem(STORAGE_KEYS.token);

    if (!user || !token) {
      return null;
    }

    return { user, token };
  },

  saveSession: (session: AuthSession) => {
    writeJson(STORAGE_KEYS.user, session.user);
    localStorage.setItem(STORAGE_KEYS.token, session.token);
  },

  updateUser: (updates: Partial<Pick<User, 'name' | 'email'>>): User | null => {
    const session = mockDbService.getSession();

    if (!session) {
      return null;
    }

    const user = { ...session.user, ...updates };
    mockDbService.saveSession({ ...session, user });

    return user;
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
  },
};
