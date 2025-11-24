@echo off
echo ========================================
echo    Setup AI Chat untuk NFT Marketplace
echo ========================================
echo.

echo 1. Membuat file .env.local...
if not exist .env.local (
    copy env.example .env.local
    echo ✓ File .env.local berhasil dibuat
) else (
    echo ✓ File .env.local sudah ada
)

echo.
echo 2. Membuka panduan setup...
start API_SETUP_GUIDE.md

echo.
echo 3. Membuka website untuk mendapatkan API key...
echo Pilih salah satu:
echo [1] Ollama (Gratis 100%% - Lokal)
echo [2] Hugging Face (Gratis - 30K requests/bulan)
echo [3] GROQ (Gratis - 100 requests/day)
echo [4] Semua website

set /p choice="Pilihan Anda (1-4): "

if "%choice%"=="1" (
    start https://ollama.ai/
) else if "%choice%"=="2" (
    start https://huggingface.co/settings/tokens
) else if "%choice%"=="3" (
    start https://console.groq.com/
) else if "%choice%"=="4" (
    start https://ollama.ai/
    start https://huggingface.co/settings/tokens
    start https://console.groq.com/
) else (
    echo Pilihan tidak valid
)

echo.
echo 4. Setelah mendapatkan API key:
echo    - Edit file .env.local
echo    - Tambahkan API key yang Anda dapatkan
echo    - Restart server dengan: npm run dev
echo.
echo 5. Chat akan otomatis menggunakan API yang tersedia
echo    dengan fallback ke mode offline jika semua API tidak tersedia.
echo.
pause




