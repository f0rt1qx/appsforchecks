import { StatusBadge } from '../StatusBadge';
import type { Status } from '../StatusBadge';

type ReceiptRowProps = {
  merchant: string;
  date: string;
  amount: number;
  status: Status;
  category?: string;
};

const statusLabel: Record<Status, string> = {
  success: 'Готово',
  pending: 'В обработке',
  error: 'Ошибка',
};

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export const ReceiptRow = ({ merchant, date, amount, status, category }: ReceiptRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b border-[rgba(255,255,255,0.07)] hover:bg-elevated smooth-transition">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-white">{merchant}</span>
        <span className="text-sm text-text-muted">
          {date}
          {category && <span> · {category}</span>}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="font-bold text-white">{currencyFormatter.format(amount)}</span>
        <StatusBadge status={status} label={statusLabel[status]} />
      </div>
    </div>
  );
};
