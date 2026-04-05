import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContentInput } from '../types';

export class GeminiService {
  private static instance: GeminiService;
  private genAI: GoogleGenerativeAI;

  private constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async *generateContentStream(input: ContentInput): AsyncGenerator<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Kamu adalah seorang ahli strategi konten Instagram profesional.

Buat konten Instagram dengan detail berikut:
- Topik: ${input.topic}
- Format: ${input.format}${input.format === 'Carousel' ? ` (${input.slides} slide)` : ''}
- Gaya Bahasa: ${input.tone}
- Struktur Copywriting: ${input.structure}
${input.referenceUrl ? `- Referensi: ${input.referenceUrl}` : ''}

Buat konten yang lengkap, menarik, dan siap pakai untuk Instagram. Gunakan format Markdown.`;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }
}
