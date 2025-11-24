# 🚀 Panduan Setup API AI Gratis untuk NFT Marketplace

## Opsi 1: Ollama (Gratis 100% - Lokal)

### Keuntungan:
- ✅ **Gratis selamanya**
- ✅ **Tidak ada limit**
- ✅ **Privasi maksimal** (jalan di komputer Anda)
- ✅ **Tidak perlu internet** setelah download model

### Cara Setup:
1. **Download Ollama**: https://ollama.ai/
2. **Install** sesuai OS Anda
3. **Download model**:
   ```bash
   ollama pull llama3.1:8b
   ```
4. **Jalankan Ollama**:
   ```bash
   ollama serve
   ```
5. **Test**: Buka http://localhost:11434

### Catatan:
- Perlu komputer dengan RAM minimal 8GB
- Download model pertama kali ~4GB
- Setelah itu bisa offline

---

## Opsi 2: Hugging Face (Gratis)

### Keuntungan:
- ✅ **Gratis** (30,000 requests/bulan)
- ✅ **Mudah setup**
- ✅ **Banyak model tersedia**

### Cara Setup:
1. **Buka**: https://huggingface.co/
2. **Sign up** dengan email/Google
3. **Buat API Token**:
   - Klik profile → Settings → Access Tokens
   - Klik "New token"
   - Beri nama: "NFT Chat"
   - Pilih "Read"
   - Copy token
4. **Tambahkan ke .env.local**:
   ```
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

---

## Opsi 3: GROQ (Gratis)

### Keuntungan:
- ✅ **100 requests/day gratis**
- ✅ **Sangat cepat**
- ✅ **Model terbaru**

### Cara Setup:
1. **Buka**: https://console.groq.com/
2. **Sign up** dengan Google/email
3. **Buat API Key**:
   - Klik "Create API Key"
   - Beri nama: "NFT Marketplace"
   - Copy key
4. **Tambahkan ke .env.local**:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

---

## Opsi 4: OpenAI (Berbayar tapi Murah)

### Keuntungan:
- ✅ **Kualitas terbaik**
- ✅ **Stabil**
- ⚠️ **$0.002 per 1K tokens** (~$2 per 1000 chat)

### Cara Setup:
1. **Buka**: https://platform.openai.com/
2. **Sign up** dan **top up** minimal $5
3. **Buat API Key**
4. **Tambahkan ke .env.local**:
   ```
   OPENAI_API_KEY=sk-your_key_here
   ```

---

## Cara Menambahkan ke Project

1. **Buat file .env.local**:
   ```bash
   copy env.example .env.local
   ```

2. **Edit .env.local** dan tambahkan API key yang Anda dapatkan

3. **Restart server**:
   ```bash
   npm run dev
   ```

---

## Prioritas Setup (Rekomendasi)

1. **Ollama** - Jika komputer Anda cukup kuat
2. **Hugging Face** - Jika ingin mudah dan cepat
3. **GROQ** - Jika ingin performa terbaik
4. **OpenAI** - Jika ingin kualitas terbaik

---

## Troubleshooting

### Error 401 (Unauthorized):
- Pastikan API key benar
- Cek apakah key masih aktif
- Restart server setelah update .env.local

### Error Connection:
- Cek koneksi internet
- Pastikan service API tidak down
- Coba API lain sebagai backup

### Ollama tidak bisa diakses:
- Pastikan Ollama sudah running: `ollama serve`
- Cek port 11434 tidak diblokir
- Restart Ollama jika perlu

---

## Fitur Fallback

Project ini sudah dilengkapi dengan **fallback responses** yang akan bekerja meskipun semua API tidak tersedia. Chat akan tetap berfungsi dengan respons pre-defined untuk pertanyaan umum tentang NFT.




