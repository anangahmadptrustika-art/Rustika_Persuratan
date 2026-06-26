-- ============================================================
-- Skema database Aplikasi Persuratan PT Rustika Global Indonesia
-- Jalankan di Supabase: Dashboard > SQL Editor > New query > Run
-- ============================================================

-- 1) Tabel utama surat
create table if not exists public.surat (
  id            uuid primary key default gen_random_uuid(),
  kategori      text not null check (kategori in ('KELUAR', 'MASUK')),
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

create index if not exists surat_kategori_idx on public.surat (kategori);
create index if not exists surat_jenis_idx on public.surat (kategori, jenis_surat);

-- 2) Aktifkan Row Level Security, tetapi izinkan akses publik (tanpa login)
alter table public.surat enable row level security;

drop policy if exists "Akses publik surat - baca" on public.surat;
drop policy if exists "Akses publik surat - tambah" on public.surat;
drop policy if exists "Akses publik surat - ubah" on public.surat;
drop policy if exists "Akses publik surat - hapus" on public.surat;

create policy "Akses publik surat - baca"
  on public.surat for select using (true);
create policy "Akses publik surat - tambah"
  on public.surat for insert with check (true);
create policy "Akses publik surat - ubah"
  on public.surat for update using (true) with check (true);
create policy "Akses publik surat - hapus"
  on public.surat for delete using (true);

-- 3) Bucket penyimpanan dokumen (publik agar bisa dibuka via link)
insert into storage.buckets (id, name, public)
values ('dokumen-surat', 'dokumen-surat', true)
on conflict (id) do update set public = true;

-- 4) Policy storage: izinkan baca & unggah publik di bucket dokumen-surat
drop policy if exists "Dokumen surat - baca publik" on storage.objects;
drop policy if exists "Dokumen surat - unggah publik" on storage.objects;
drop policy if exists "Dokumen surat - hapus publik" on storage.objects;

create policy "Dokumen surat - baca publik"
  on storage.objects for select
  using (bucket_id = 'dokumen-surat');

create policy "Dokumen surat - unggah publik"
  on storage.objects for insert
  with check (bucket_id = 'dokumen-surat');

create policy "Dokumen surat - hapus publik"
  on storage.objects for delete
  using (bucket_id = 'dokumen-surat');
