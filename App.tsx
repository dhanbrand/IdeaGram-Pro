/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Layout, 
  Layers, 
  Type, 
  MessageSquare, 
  ChevronRight,
  Loader2,
  RefreshCw,
  Instagram,
  Copy,
  Check,
  Lock,
  User,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ContentFormat = 'Single' | 'Carousel' | 'Promosi' | 'Event' | 'Tutorial' | 'Tips' | 'Testimonial';
type Tone = 'Formal' | 'Santai' | 'Provokatif' | 'Edukatif' | 'Storytelling' | 'Inspiratif' | 'Humoris' | 'To-the-point' | 'Empatik' | 'Profesional' | 'Misterius' | 'Berani' | 'Ramah' | 'Elegan';
type CopywritingStructure = 'PAS' | 'AIDA' | 'BAB' | 'ACCA' | '5 Questions' | '4U' | '4C' | 'Bebas';

interface ContentInput {
  topic: string;
  referenceUrl: string;
  tone: Tone;
  format: ContentFormat;
  slides: number;
  structure: CopywritingStructure;
}

const SYSTEM_INSTRUCTION = `Anda adalah IdeaGram Pro Strategist, seorang pakar strategi konten media sosial dan copywriter profesional yang spesialis dalam membangun Personal Branding di Instagram.

Tujuan: Membantu pengguna menghasilkan ide konten Instagram yang terstruktur untuk memperkuat otoritas dan personal brand mereka.

Output harus mencakup:
1. Judul Konten (Headline yang memicu klik).
2. Struktur Slide (untuk Carousel) atau Poin Utama (untuk Single Post).
3. Copywriting Caption (lengkap dengan Hook, Body, dan Call to Action).
4. Rekomendasi Visual.
5. Image Generation Prompt (dalam bahasa Inggris, dalam blok kode).

Aturan:
- Gunakan bahasa Indonesia yang natural.
- Gunakan format Markdown yang rapi.
- Sertakan hashtag relevan.`;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try { return localStorage.getItem('ideagram_auth') === 'true'; } catch { return false; }
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [input, setInput] = useState<ContentInput>({
    topic: '',
    referenceUrl: '',
    tone: 'Edukatif',
    format: 'Carousel',
    slides: 5,
    structure: 'Bebas',
  });
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'user' && password === 'user1234') {
      setIsLoggedIn(true);
      try { localStorage.setItem('ideagram_auth', 'true'); } catch {}
      setLoginError('');
    } else {
      setLoginError('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try { localStorage.removeItem('ideagram_auth'); } catch {}
  };

  const handleGenerate = async () => {
    if (!input.topic.trim()) return;
    setIsLoading(true);
    setOutput('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const prompt = `Buatlah konten Instagram dengan detail berikut:
Topik: ${input.topic}
${input.referenceUrl ? `Referensi: ${input.referenceUrl}` : ''}
Gaya Bahasa: ${input.tone}
Format: ${input.format}
Struktur Copywriting: ${input.structure === 'Bebas' ? 'AI Pilihan Terbaik' : input.structure}
Jumlah Slide: ${input.format === 'Carousel' ? input.slides : 1}`;

      const result = await ai.models.generateContentStream({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
      });

      let fullText = '';
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setOutput(fullText);
          if (outputRef.current) {
            outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      setOutput("Maaf, terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-[#e11d48] p-8 text-center space-y-2">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <Instagram className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">IdeaGram Pro</h1>
            <p className="text-rose-100 text-sm">Masuk untuk mulai merancang strategi konten</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3 h-3" /> Username
                </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-800" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-800" required />
              </div>
            </div>
            {loginError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs font-medium text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                {loginError}
              </motion.p>
            )}
            <button type="submit"
              className="w-full py-4 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2">
              <span>Masuk Sekarang</span><ChevronRight className="w-4 h-4" />
            </button>
          </form>
          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              IdeaGram Pro &copy; {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#e11d48] rounded-lg flex items-center justify-center shadow-lg shadow-rose-200">
              <Instagram className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              IdeaGram <span className="text-[#e11d48]">Pro</span>
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => { setInput({ topic: '', referenceUrl: '', tone: 'Edukatif', format: 'Carousel', slides: 5, structure: 'Bebas' }); setOutput(''); }}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-6">
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#e11d48]" /> Topik Konten
            </label>
            <textarea value={input.topic} onChange={(e) => setInput({ ...input, topic: e.target.value })}
              placeholder="Contoh: Tips Investasi untuk Pemula..."
              className="w-full min-h-[100px] p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none text-slate-800 placeholder:text-slate-400" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-[#e11d48]" /> Referensi Konten (Link Instagram)
            </label>
            <input type="url" value={input.referenceUrl} onChange={(e) => setInput({ ...input, referenceUrl: e.target.value })}
              placeholder="https://www.instagram.com/p/..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#e11d48]" /> Gaya Bahasa
              </label>
              <select value={input.tone} onChange={(e) => setInput({ ...input, tone: e.target.value as Tone })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm">
                {['Edukatif','Santai','Formal','Provokatif','Storytelling','Inspiratif','Humoris','To-the-point','Empatik','Profesional','Misterius','Berani','Ramah','Elegan'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Layout className="w-4 h-4 text-[#e11d48]" /> Format
              </label>
              <select value={input.format} onChange={(e) => setInput({ ...input, format: e.target.value as ContentFormat })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm">
                <option value="Carousel">Carousel</option>
                <option value="Single">Single Post</option>
                <option value="Promosi">Promosi</option>
                <option value="Event">Event</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Tips">Tips & Trick</option>
                <option value="Testimonial">Testimonial</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e11d48]" /> Struktur Copywriting
            </label>
            <select value={input.structure} onChange={(e) => setInput({ ...input, structure: e.target.value as CopywritingStructure })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm">
              <option value="Bebas">Bebas Rekomendasi (AI Pilihan Terbaik)</option>
              <option value="PAS">PAS (Problem, Agitate, Solution)</option>
              <option value="AIDA">AIDA (Attention, Interest, Desire, Action)</option>
              <option value="BAB">BAB (Before, After, Bridge)</option>
              <option value="ACCA">ACCA (Awareness, Comprehension, Conviction, Action)</option>
              <option value="5 Questions">5 Questions</option>
              <option value="4U">4U (Urgent, Unique, Ultra-specific, Useful)</option>
              <option value="4C">4C (Clear, Concise, Compelling, Credible)</option>
            </select>
          </div>

          {input.format === 'Carousel' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e11d48]" /> Jumlah Slide ({input.slides})
              </label>
              <input type="range" min="3" max="10" value={input.slides}
                onChange={(e) => setInput({ ...input, slides: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#e11d48]" />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                <span>3 Slide</span><span>10 Slide</span>
              </div>
            </motion.div>
          )}

          <button onClick={handleGenerate} disabled={isLoading || !input.topic.trim()}
            className="w-full py-4 bg-[#e11d48] hover:bg-[#be123c] disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Sedang Meracik...</span></>
            ) : (
              <><Sparkles className="w-5 h-5" /><span>Buat Konten</span></>
            )}
          </button>
        </section>

        <AnimatePresence>
          {output && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#e11d48]" /> Hasil Strategis
                </span>
                <button onClick={copyToClipboard} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-[#e11d48]">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="p-5 prose prose-slate prose-sm max-w-none">
                <Markdown>{output}</Markdown>
                <div ref={outputRef} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {!output && !isLoading && (
          <div className="py-12 flex flex-col items-center text-center space-y-4 px-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-700">Belum ada ide?</h3>
              <p className="text-sm text-slate-400">Masukkan topik di atas dan biarkan IdeaGram Pro merancang strategi konten untukmu.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 text-center border-t border-slate-100 mt-auto">
        <p className="text-xs text-slate-400 font-medium">
          IdeaGram Pro &copy; {new Date().getFullYear()} (dhanbrand)
        </p>
      </footer>
    </div>
  );
}
