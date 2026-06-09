import type { ChangeEvent, DragEvent } from 'react';
import { useRef, useState } from 'react';
import { FileImage, UploadCloud } from 'lucide-react';

type DropZoneProps = {
  fileName?: string;
  isDisabled?: boolean;
  onFileSelect: (file: File) => void;
};

export const DropZone = ({ fileName, isDisabled = false, onFileSelect }: DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (file?: File) => {
    if (!file || isDisabled) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    onFileSelect(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          inputRef.current?.click();
        }
      }}
      className={`smooth-transition group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center ${
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-white/20 hover:bg-elevated/50'
      } ${isDisabled ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={isDisabled}
      />

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary smooth-transition group-hover:bg-primary group-hover:text-white">
        {fileName ? <FileImage size={32} /> : <UploadCloud size={32} />}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">
        {fileName ?? 'Перетащите чек сюда'}
      </h3>
      <p className="max-w-md text-sm leading-6 text-text-muted">
        Нажмите, чтобы выбрать изображение с компьютера, или перетащите файл в эту область.
      </p>
    </div>
  );
};
