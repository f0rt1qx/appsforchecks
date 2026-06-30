export class StorageService {
  private readonly storage: Storage | null;

  constructor(storage: Storage | null = getBrowserStorage()) {
    this.storage = storage;
  }

  get<T>(key: string): T | null {
    if (!this.storage) {
      return null;
    }

    const rawValue = this.storage.getItem(key);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      this.remove(key);
      return null;
    }
  }

  set<T>(key: string, value: T) {
    this.storage?.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    this.storage?.removeItem(key);
  }
}

const getBrowserStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const storageService = new StorageService();
