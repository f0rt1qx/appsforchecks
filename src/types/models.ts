export type UserRole = 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export type ReceiptStatus = 'success' | 'pending' | 'error';

export interface Receipt {
  id: string;
  userId: string;
  merchant: string;
  date: string;
  amount: number;
  status: ReceiptStatus;
  category: string;
  createdAt: string;
  rawText?: string;
}
