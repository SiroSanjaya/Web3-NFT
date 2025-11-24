# 🚀 Setup Cepat AI Chat Gratis

## Langkah 1: Buat file .env.local

```bash
copy env.example .env.local
```

## Langkah 2: Pilih API Gratis (Pilih salah satu)

### Opsi A: Ollama (Gratis 100% - Rekomendasi)
1. Download: https://ollama.ai/
2. Install dan jalankan: `ollama serve`
3. Download model: `ollama pull llama3.1:8b`
4. **Tidak perlu API key!** Langsung bisa digunakan

### Opsi B: Hugging Face (Gratis 30K requests/bulan)
1. Buka: https://huggingface.co/settings/tokens
2. Sign up dan buat API token
3. Edit `.env.local` dan tambahkan:
   ```
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

### Opsi C: GROQ (Gratis 100 requests/day)
1. Buka: https://console.groq.com/
2. Sign up dan buat API key
3. Edit `.env.local` dan tambahkan:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

## Langkah 3: Restart Server

```bash
npm run dev
```

## Langkah 4: Test Chat

Buka http://localhost:3000 dan coba fitur chat AI!

---

## 🎯 Prioritas Setup (Rekomendasi)

1. **Ollama** - Jika komputer Anda RAM 8GB+
2. **Hugging Face** - Jika ingin mudah dan cepat
3. **GROQ** - Jika ingin performa terbaik

---

## 🔧 Troubleshooting

### Chat tidak berfungsi:
- Pastikan file `.env.local` sudah dibuat
- Restart server setelah edit `.env.local`
- Cek console browser untuk error

### API key error:
- Pastikan API key benar dan aktif
- Coba API lain sebagai backup
- Chat akan tetap berfungsi dengan fallback mode

### Ollama error:
- Pastikan Ollama running: `ollama serve`
- Cek port 11434 tidak diblokir
- Download model: `ollama pull llama3.1:8b`

---

## 💡 Fitur Fallback

Project ini sudah dilengkapi dengan **fallback responses** yang akan bekerja meskipun semua API tidak tersedia. Chat akan tetap berfungsi dengan respons pre-defined untuk pertanyaan umum tentang NFT.




