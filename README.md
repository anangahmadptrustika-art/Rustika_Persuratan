# Aplikasi Persuratan — PT Rustika Global Indonesia

Aplikasi web untuk **mencatat dan mengakses surat keluar & surat masuk** agar
mudah dilihat atasan (HRD, Komisaris, Direktur). Tanpa login, jalan di **HP
maupun browser laptop**.

Alur: **Beranda → pilih Surat Keluar / Surat Masuk → pilih jenis surat → lihat
daftar surat (tanggal, nomor, tujuan, perihal) → buka dokumennya.** Surat baru
ditambah lewat tombol **“+ Tambah Surat”**, dokumen Word/PDF diunggah manual.

Dibangun dengan **Next.js** (React) + **Neon Postgres** (database) + **Vercel
Blob** (penyimpanan file). Warna: abu-abu, putih, biru, hitam.

---

## 🚀 Cara setup di Vercel (sekali saja, ±10 menit)

Aplikasi ini sudah terhubung otomatis ke Vercel. Yang perlu ditambahkan hanya
**database** dan **penyimpanan file**, keduanya tersedia gratis di Vercel.

### 1. Tambah database Neon Postgres
1. Buka project **rustika-persuratan** di <https://vercel.com>.
2. Masuk tab **Storage → Create Database → Neon (Postgres)** → ikuti, pilih
   region terdekat (Singapore), lalu **Connect** ke project ini.
3. Vercel otomatis menambahkan env var `DATABASE_URL` ke project.
   > Tabel surat **dibuat otomatis** oleh aplikasi saat pertama kali dibuka,
   > dan langsung diisi 18 data surat keluar dari Excel. Tidak perlu jalankan
   > SQL manual. (File `db/schema.sql` hanya untuk referensi.)

### 2. Tambah penyimpanan Vercel Blob
1. Di tab **Storage → Create → Blob**, beri nama (mis. `dokumen-surat`),
   lalu **Connect** ke project ini.
2. Vercel otomatis menambahkan env var `BLOB_READ_WRITE_TOKEN`.

### 3. Redeploy
Buka tab **Deployments → (deploy terbaru) → ⋯ → Redeploy** agar env var baru
terpakai. Selesai — aplikasi langsung berfungsi dan bisa dibuka di HP/laptop.

---

## 💻 Menjalankan lokal (opsional)

```bash
npm install
cp .env.local.example .env.local   # isi DATABASE_URL & BLOB_READ_WRITE_TOKEN
npm run dev                         # buka http://localhost:3000
```

`DATABASE_URL` bisa diambil dari connection string Neon, dan
`BLOB_READ_WRITE_TOKEN` dari Storage → Blob → `.env.local` di dashboard Vercel.

---

## 🗂️ Struktur data surat

| Field | Keterangan |
|-------|------------|
| Kategori | `KELUAR` atau `MASUK` |
| Jenis Surat | Surat Permohonan, Surat Kuasa, Surat Perjanjian, Surat Keputusan, Berita Acara, Surat Pemberitahuan, atau jenis baru |
| Tanggal Surat | tanggal surat |
| Nomor Surat | nomor resmi surat |
| Tujuan Surat | tujuan / pihak terkait |
| Perihal | inti / judul surat |
| Lampiran | jumlah/keterangan lampiran |
| Tembusan | pihak yang ditembusi |
| Keterangan | catatan tambahan |
| Dokumen | file Word/PDF/gambar yang diunggah |

---

## 🧱 Arsitektur singkat

- **Frontend**: Next.js App Router (komponen client).
- **API**: route di `app/api/surat` (CRUD) & `app/api/upload` (token unggah Blob).
- **Database**: Neon Postgres via `@neondatabase/serverless` (`lib/db.js`).
  Skema & data awal dibuat otomatis.
- **File**: Vercel Blob (`@vercel/blob`), unggah langsung dari browser (client
  upload) agar mendukung file besar.

## 📝 Catatan
- **Tanpa login** sesuai permintaan — siapa pun yang punya link bisa melihat &
  menambah surat. Jika nanti perlu dibatasi, login bisa ditambahkan.
- Jenis surat baru bisa ditambah lewat pilihan **“Lainnya”** pada form.
