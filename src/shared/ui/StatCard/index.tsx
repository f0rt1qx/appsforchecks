interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
}

export const StatCard = ({ title, value, trend, isPositive }: StatCardProps) => {
  return (
    <div className="bg-surface border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
      <div className="text-text-muted font-medium mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-[32px] font-bold text-white leading-none">{value}</div>
        {trend && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-500'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};
