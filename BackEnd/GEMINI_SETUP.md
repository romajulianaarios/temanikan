# Setup Gemini AI untuk Temanikan

## Langkah-langkah Setup

### 1. Dapatkan API Key dari Google AI Studio

1. Kunjungi: https://makersuite.google.com/app/apikey
2. Login dengan akun Google Anda
3. Klik "Create API Key"
4. Copy API key yang diberikan

### 2. Setup di Backend

Tambahkan API key ke file `.env` di folder `BackEnd/`:

```env
GEMINI_API_KEY=your_api_key_here
```

Atau jika tidak ada file `.env`, tambahkan langsung di `config.py`:

```python
GEMINI_API_KEY = 'your_api_key_here'
```

### 3. Install Dependencies

**Cara Mudah (Recommended):**

Double-click file `install_dependencies.bat` di folder `BackEnd/`

Atau jalankan di PowerShell:
```powershell
cd BackEnd
.\install_dependencies.ps1
```

**Cara Manual:**

Jalankan di folder `BackEnd/`:

```bash
pip install -r requirements.txt
```

Atau install manual:
```bash
pip install google-generativeai==0.3.2 Pillow==10.2.0
```

Dependencies yang diperlukan:
- `google-generativeai==0.3.2`
- `Pillow==10.2.0`

### 4. Migrate Database

Jalankan migrasi database untuk menambahkan tabel `chat_history`:

```bash
python migrate_db.py
```

Atau jika menggunakan Flask CLI:

```bash
flask db upgrade
```

## Fitur AI Chat

### Endpoints yang Tersedia

1. **POST /api/ai/chat** - Mengirim pesan ke AI
   - Body: `{ "message": "pertanyaan", "image": "base64_image" (optional) }`
   - Response: `{ "response": "jawaban AI", "chat_id": 1 }`

2. **GET /api/ai/chat/history** - Mendapatkan history chat
   - Query params: `limit` (default: 50)
   - Response: `{ "chats": [...], "count": 10 }`

3. **DELETE /api/ai/chat/:id** - Menghapus chat dari history

### Fitur

- ✅ Chat real-time dengan Gemini AI
- ✅ Upload foto ikan untuk diagnosis
- ✅ History chat tersimpan di database
- ✅ Context dari database ikan (FishPedia)
- ✅ Protected route (harus login)
- ✅ Widget AI Chat di beberapa halaman

### Penggunaan di Frontend

AI Chat widget akan muncul sebagai floating button di:
- Member Dashboard
- Public Fishpedia (jika sudah login)
- Halaman lain yang menggunakan `AIChatButton` component

## Catatan

- Gemini API memiliki free tier dengan limit tertentu
- Untuk production, pertimbangkan rate limiting
- History chat disimpan di database untuk referensi

