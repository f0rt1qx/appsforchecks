import { create } from 'zustand';
import { storageService } from '@/services/storage.service';
import type { Receipt } from '@/types/models';
import { createReceipt } from '@/utils/factories';

type AddReceiptInput = Pick<Receipt, 'userId' | 'merchant' | 'date' | 'amount' | 'category'> &
  Partial<Pick<Receipt, 'rawText' | 'status'>>;

type ReceiptsState = {
  receipts: Receipt[];
  addReceipt: (input: AddReceiptInput) => Receipt;
  loadReceipts: (userId: string) => void;
};

const RECEIPTS_STORAGE_KEY = 'receipt-scanner-receipts';

const getSavedReceipts = () => storageService.get<Receipt[]>(RECEIPTS_STORAGE_KEY) ?? [];

const saveReceipts = (receipts: Receipt[]) => {
  storageService.set(RECEIPTS_STORAGE_KEY, receipts);
};

const getUserReceipts = (userId: string) =>
  getSavedReceipts()
    .filter((receipt) => receipt.userId === userId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

export const useReceiptsStore = create<ReceiptsState>((set) => ({
  receipts: [],

  addReceipt: (input) => {
    const receipt = createReceipt(input);
    const allReceipts = [receipt, ...getSavedReceipts()];

    saveReceipts(allReceipts);
    set({ receipts: getUserReceipts(input.userId) });

    return receipt;
  },

  loadReceipts: (userId) => {
    set({ receipts: getUserReceipts(userId) });
  },
}));
