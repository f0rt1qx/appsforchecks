import Tesseract from 'tesseract.js';

export type OcrProgressHandler = (progress: number) => void;

export interface OcrRecognizer {
  recognize(imageFile: File, onProgress?: OcrProgressHandler): Promise<string>;
}

export class OcrService implements OcrRecognizer {
  private readonly languages: string;

  constructor(languages = 'rus+eng') {
    this.languages = languages;
  }

  async recognize(imageFile: File, onProgress?: OcrProgressHandler) {
    onProgress?.(0);

    const result = await Tesseract.recognize(imageFile, this.languages, {
      logger: (message) => {
        if (message.status === 'recognizing text') {
          onProgress?.(Math.round(message.progress * 100));
        }
      },
    });

    onProgress?.(100);

    return result.data.text.trim();
  }
}

export const ocrService = new OcrService();
