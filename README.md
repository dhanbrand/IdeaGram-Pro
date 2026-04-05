# IdeaGram Pro - Deployment Guide (Vercel)

Aplikasi ini siap untuk di-deploy ke Vercel. Ikuti langkah-langkah di bawah ini:

## Langkah-langkah Deploy:

1.  **Hubungkan ke GitHub**: Upload kode ini ke repositori GitHub Anda.
2.  **Import ke Vercel**: Masuk ke dashboard Vercel dan pilih "New Project", lalu import repositori tersebut.
3.  **Konfigurasi Environment Variable**:
    -   Buka bagian **Environment Variables** di pengaturan proyek Vercel.
    -   Tambahkan key: `GEMINI_API_KEY`
    -   Masukkan value: (Dapatkan API Key Anda dari [Google AI Studio](https://aistudio.google.com/app/apikey)).
4.  **Build Settings**:
    -   Framework Preset: `Vite`
    -   Build Command: `npm run build`
    -   Output Directory: `dist`
5.  **Deploy**: Klik tombol "Deploy".

## Konfigurasi yang Tersedia:

-   `vercel.json`: Menangani routing Single Page Application (SPA) agar tidak terjadi error 404 saat refresh halaman.
-   `.env.example`: Daftar variabel lingkungan yang diperlukan.

---
IdeaGram Pro &copy; 2026
