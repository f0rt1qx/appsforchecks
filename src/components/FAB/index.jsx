import { Plus } from 'lucide-react';

export const FAB = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:shadow-primary/25 smooth-transition z-50"
    >
      <Plus size={24} strokeWidth={2.5} />
    </button>
  );
};
