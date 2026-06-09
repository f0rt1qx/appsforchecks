import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { LoaderCircle, RotateCcw, Save, ScanText } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { DropZone } from '@/components/DropZone';
import { FormInput } from '@/components/FormInput';

type OcrStatus = 'idle' | 'processing' | 'success' | 'error';

type ReceiptDraft = {
  merchant: string;
  date: string;
  amount: string;
  category: string;
};

const initialDraft: ReceiptDraft = {
  merchant: '',
  date: '',
  amount: '',
  category: 'Продукты',
};

const extractAmount = (text: string) => {
  const amountMatches = text.match(/\d+[.,]\d{2}/g);

  if (!amountMatches?.length) {
    return '';
  }

  return amountMatches[amountMatches.length - 1].replace(',', '.');
};

const extractDate = (text: string) => {
  const dateMatch = text.match(/\b\d{2}[./-]\d{2}[./-]\d{2,4}\b/);
  return dateMatch?.[0] ?? '';
};

const extractMerchant = (text: string) => {
  const firstUsefulLine = text
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length >= 3 && /[a-zа-яё]/i.test(line));

  return firstUsefulLine ?? '';
};

const createDraftFromText = (text: string): ReceiptDraft => ({
  merchant: extractMerchant(text),
  date: extractDate(text),
  amount: extractAmount(text),
  category: 'Продукты',
});

export const ScannerPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<OcrStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState('');
  const [draft, setDraft] = useState<ReceiptDraft>(initialDraft);
  const [error, setError] = useState('');

  const canRunOcr = selectedFile && status !== 'processing';
  const progressPercent = useMemo(() => Math.round(progress * 100), [progress]);

  const handleFileSelect = (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus('idle');
    setProgress(0);
    setRawText('');
    setDraft(initialDraft);
    setError('');
  };

  const handleRecognize = async () => {
    if (!selectedFile) {
      return;
    }

    setStatus('processing');
    setProgress(0);
    setError('');

    try {
      const result = await Tesseract.recognize(selectedFile, 'rus+eng', {
        logger: (message) => {
          if (message.status === 'recognizing text') {
            setProgress(message.progress);
          }
        },
      });

      const text = result.data.text.trim();
      setRawText(text);
      setDraft(createDraftFromText(text));
      setStatus('success');
    } catch {
      setStatus('error');
      setError('Не удалось распознать чек. Попробуйте другое изображение или повторите позже.');
    }
  };

  const updateDraft = (field: keyof ReceiptDraft) => (event: ChangeEvent<HTMLInputElement>) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setProgress(0);
    setRawText('');
    setDraft(initialDraft);
    setError('');
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold">
          <span className="text-white">OCR</span>{' '}
          <span className="text-light">сканер</span>
        </h1>
        <p className="mt-3 max-w-2xl text-text-muted">
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-6">
          <div className="rounded-2xl border border-white/[0.07] bg-surface p-5">
            <DropZone
              fileName={selectedFile?.name}
              isDisabled={status === 'processing'}
              onFileSelect={handleFileSelect}
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRecognize}
                disabled={!canRunOcr}
                className="smooth-transition flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white hover:bg-light disabled:pointer-events-none disabled:opacity-50"
              >
                {status === 'processing' ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <ScanText size={18} />
                )}
                Распознать чек
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={status === 'processing' && !selectedFile}
                className="smooth-transition flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-elevated px-4 font-semibold text-text-muted hover:text-white disabled:pointer-events-none disabled:opacity-50"
              >
                <RotateCcw size={18} />
                Сбросить
              </button>
            </div>

            {status === 'processing' && (
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-text-muted">Распознавание текста</span>
                  <span className="font-semibold text-white">{progressPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-elevated">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="rounded-2xl border border-white/[0.07] bg-surface p-5">
              <h2 className="mb-4 text-lg font-bold text-white">Превью файла</h2>
              <img
                src={previewUrl}
                alt="Загруженный чек"
                className="max-h-[420px] w-full rounded-xl object-contain"
              />
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <form className="rounded-2xl border border-white/[0.07] bg-surface p-5">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Результат распознавания</h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Поля заполняются автоматически после OCR. Исправьте значения вручную, если распознавание ошиблось.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Магазин"
                value={draft.merchant}
                placeholder="Например, ВкусВилл"
                onChange={updateDraft('merchant')}
              />
              <FormInput
                label="Дата"
                value={draft.date}
                placeholder="09.06.2026"
                onChange={updateDraft('date')}
              />
              <FormInput
                label="Сумма"
                value={draft.amount}
                placeholder="1840.00"
                inputMode="decimal"
                onChange={updateDraft('amount')}
              />
              <FormInput
                label="Категория"
                value={draft.category}
                placeholder="Продукты"
                onChange={updateDraft('category')}
              />
            </div>

            <button
              type="button"
              disabled={status !== 'success'}
              className="smooth-transition mt-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white hover:bg-light disabled:pointer-events-none disabled:opacity-50"
            >
              <Save size={18} />
              Подготовить чек
            </button>
          </form>

          <div className="rounded-2xl border border-white/[0.07] bg-surface p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Распознанный текст</h2>
            <div className="min-h-56 whitespace-pre-wrap rounded-xl border border-white/[0.07] bg-elevated/70 p-4 text-sm leading-6 text-text-muted">
              {rawText || 'Здесь появится сырой текст после распознавания изображения.'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
