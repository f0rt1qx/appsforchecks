import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const FormInput = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-text-muted">{label}</label>
      <input
        className={twMerge(
          clsx(
            "bg-elevated border border-[rgba(255,255,255,0.07)] rounded-xl px-4 h-11 text-white outline-none smooth-transition focus:border-primary focus:ring-1 focus:ring-primary",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
