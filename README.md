# Aplikasi Persuratan — PT Rustika Global Indonesia

Aplikasi web untuk **mencatat dan mengakses surat keluar & surat masuk** agar
mudah dilihat atasan (HRD, Komisaris, Direktur). Tanpa login, jalan di **HP
maupun browser laptop**.

Alur: **Beranda → pilih Surat Keluar / Surat Masuk → pilih jenis surat → lihat
daftar surat (tanggal, nomor, tujuan, perihal) → buka dokumennya.** Surat baru
ditambah lewat tombol **“+ Tambah Surat”**, dokumen Word/PDF diunggah manual.

Dibangun dengan **Next.js** (React) + **Supabase** (database PostgreSQL +
penyimpanan file). Warna: abu-abu, putih, biru, hitam.

---

## 🚀 Cara setup (sekali saja, ±10 menit)

### 1. Buat project Supabase (gratis)
1. Daftar / masuk di <https://supabase.com>.
2. Klik **New project**, beri nama (mis. `rustika-persuratan`), simpan password
   database, pilih region terdekat (Singapore), lalu **Create**.

### 2. Buat tabel & penyimpanan
1. Di dashboard Supabase, buka menu **SQL Editor → New query**.
2. Salin seluruh isi file [`supabase/schema.sql`](supabase/schema.sql),
   tempel, lalu klik **Run**.
3. (Opsional) Untuk memuat data surat yang sudah ada dari Excel, jalankan juga
   isi file [`supabase/seed.sql`](supabase/seed.sql) dengan cara yang sama.

### 3. Ambil kunci API
Buka **Project Settings → API**, salin dua nilai ini:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Jalankan / deploy
Salin `.env.local.example` menjadi `.env.local`, isi kedua nilai di atas.

**Jalankan lokal:**
```bash
npm install
npm run dev
# buka http://localhost:3000
```

**Deploy online (Vercel):**
1. Buka <https://vercel.com>, **Add New → Project**, import repository ini.
2. Pada **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Klik **Deploy**. Aplikasi langsung bisa dibuka lewat link Vercel di HP/laptop.

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

## 📝 Catatan
- **Tanpa login** sesuai permintaan — siapa pun yang punya link bisa melihat &
  menambah surat. Jika nanti perlu dibatasi, login bisa ditambahkan.
- Bucket penyimpanan bersifat **publik** agar dokumen bisa dibuka lewat link.
- Jenis surat baru bisa ditambah lewat pilihan **“Lainnya”** pada form.
