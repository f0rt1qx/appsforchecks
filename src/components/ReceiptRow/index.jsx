import { StatusBadge } from '../StatusBadge';

export const ReceiptRow = ({ merchant, date, amount, status }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.07)] hover:bg-elevated smooth-transition">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-white">{merchant}</span>
        <span className="text-sm text-text-muted">{date}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-white">${amount.toFixed(2)}</span>
        <StatusBadge status={status} label={status.charAt(0).toUpperCase() + status.slice(1)} />
      </div>
    </div>
  );
};
