# Ristek Task Frontend

> **📄 Catatan Deployment:** Cara deployment menggunakan **Docker Compose** sudah disertakan di dalam **submisi PDF**.

---

## Prasyarat

Pastikan sudah terinstall:

- [Node.js 20+](https://nodejs.org/) (disarankan versi 24)
- npm

---

## Cara Menjalankan Secara Lokal

> **⚠️ Perhatian** Pastikan [applikasi backend](https://github.com/fossyy/ristek-task-be) sudah berjalan dan dapat di akses.

### 1. Clone Repository

```bash
git clone https://github.com/fossyy/ristek-task-fe
cd ristek-task-fe
```

### 2. Konfigurasi Environment

Buat file `.env` di root project:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Jalankan Aplikasi (Development)

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### 5. Build & Jalankan Production

```bash
npm run build
npm run start
```

Aplikasi production berjalan di `http://localhost:3000`.

---

## Environment Variables

| Variable             | Wajib | Default | Keterangan                     |
| -------------------- | ----- | ------- | ------------------------------ |
| `VITE_API_BASE_URL`  | ✅    | —       | URL backend API                |
