# Rustika Persuratan

Aplikasi web pencatatan & arsip **surat keluar/masuk** PT Rustika Global Indonesia.
Tanpa login, jalan di HP & laptop.

## Stack
- **Next.js** (App Router, JavaScript) + **Tailwind CSS** + **lucide-react**
- **Neon Postgres** via `@neondatabase/serverless` (`lib/db.js`) — tabel & data awal dibuat otomatis
- **Vercel Blob** (store **private**) untuk dokumen; ditampilkan lewat proxy `app/api/file/route.js`
- Deploy di **Vercel** (branch produksi: `main`)

## Struktur penting
- `app/page.js` — beranda (Surat Keluar / Masuk)
- `app/surat/[kategori]/page.js` — daftar jenis surat
- `app/surat/[kategori]/[jenis]/page.js` — daftar surat + unggah/lihat/hapus dokumen
- `app/tambah/page.js` — form tambah surat
- `app/api/surat/route.js` — CRUD surat (GET/POST/PATCH/DELETE)
- `app/api/upload/route.js` — unggah file ke Blob (server-side)
- `app/api/file/route.js` — proxy menampilkan file Blob private
- `lib/` — `db.js`, `api.js`, `blob.js`, `constants.js`, `icons.js`, `seedData.js`

## Env (server-only, set di Vercel)
- `DATABASE_URL` — Neon Postgres
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (Production)

## Aturan keamanan — WAJIB diikuti tiap sesi
@.claude/rules/security-nextjs.md
