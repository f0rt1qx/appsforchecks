import type { Receipt, User } from '@/types/models';

type CreateUserData = Pick<User, 'email' | 'name'> & Partial<Pick<User, 'role'>>;

type CreateReceiptData = Pick<Receipt, 'userId' | 'merchant' | 'date' | 'amount' | 'category'> &
  Partial<Pick<Receipt, 'rawText' | 'status'>>;

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createUser = (data: CreateUserData): User => ({
  id: createId(),
  email: data.email.trim().toLowerCase(),
  name: data.name.trim(),
  role: data.role ?? 'user',
  createdAt: new Date().toISOString(),
});

export const createReceipt = (data: CreateReceiptData): Receipt => ({
  id: createId(),
  userId: data.userId,
  merchant: data.merchant.trim(),
  date: data.date.trim(),
  amount: data.amount,
  status: data.status ?? 'success',
  category: data.category.trim(),
  createdAt: new Date().toISOString(),
  rawText: data.rawText?.trim(),
});
