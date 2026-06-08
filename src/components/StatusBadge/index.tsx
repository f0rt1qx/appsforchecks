export type Status = 'success' | 'pending' | 'error';

const statusConfig: Record<Status, string> = {
  success: 'bg-success/10 text-success border-success/20',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20',
};

type StatusBadgeProps = {
  status: Status;
  label: string;
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusConfig[status]}`}>
      {label}
    </span>
  );
};
