import { UploadCloud } from 'lucide-react';

export const DropZone = () => {
  return (
    <div className="border-2 border-dashed border-[rgba(255,255,255,0.2)] rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-elevated/50 smooth-transition cursor-pointer group">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white smooth-transition">
        <UploadCloud size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Перетащите чек сюда</h3>
      <p className="text-text-muted">или нажмите, чтобы выбрать файл на компьютере</p>
    </div>
  );
};
