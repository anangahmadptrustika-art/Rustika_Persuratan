-- ============================================================
-- Skema database Aplikasi Persuratan (Neon / PostgreSQL)
-- CATATAN: Tabel ini DIBUAT OTOMATIS oleh aplikasi saat pertama kali
-- dijalankan (lihat lib/db.js). File ini hanya untuk referensi / jika
-- Anda ingin membuatnya manual lewat Neon SQL Editor.
-- ============================================================

create table if not exists surat (
  id            uuid primary key default gen_random_uuid(),
  kategori      text not null,           -- 'KELUAR' atau 'MASUK'
  jenis_surat   text not null,
  tanggal_surat date,
  nomor_surat   text,
  tujuan_surat  text,
  perihal       text not null,
  lampiran      text,
  tembusan      text,
  keterangan    text,
  file_url      text,
  file_path     text,
  created_at    timestamptz not null default now()
);

create index if not exists surat_kategori_idx on surat (kategori);
create index if not exists surat_jenis_idx on surat (kategori, jenis_surat);
