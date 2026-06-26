-- Seed data surat keluar (dari file Excel PT Rustika Global Indonesia)
-- Jalankan SETELAH schema.sql. Aman dijalankan sekali (hapus baris jika ingin mulai kosong).

insert into public.surat
  (kategori, jenis_surat, tanggal_surat, nomor_surat, tujuan_surat, perihal, lampiran, tembusan, keterangan)
values
  ('KELUAR', 'Surat Permohonan', null, '01/B-RUST/IX/2024', 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Luwu Timur', 'Surat Permohonan Kesesuaian Rencana Tata Ruang Wilayah (RTRW)', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Permohonan', null, '02/B-RUST/I/2025', 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Luwu Timur. Kepala Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP) Luwu Timur', 'Surat Permohonan Pertemuan Terkait KKPR PT Vale Indonesia', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Permohonan', null, '05/B-RUST/II/2025', 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Luwu Timur', 'Surat Permohonan Keterangan Proses PBG & SLF', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Permohonan', null, '06/B-RUST/II/2025', 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Luwu Timur', 'Surat Permohonan Keterangan Proses PBG & SLF', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Permohonan', '2025-07-24', '001/SP/RUSTICGROUP-HR/VII/2025', 'Bupati Luwu Timur', 'Permohonan Penyiraman Bundara Batara Guru', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Permohonan', '2025-07-24', '002/SP/RUSTICGROUP-HR/VII/2025', 'Kepala Dinas Pemadam Kebakaran (DAMKAR) Luwu Timur', 'Permohonan Penyiraman Bundara Batara Guru', '1', '- Bupati Luwu Timur       - PT Vale Indonesia', null),
  ('KELUAR', 'Surat Permohonan', '2025-07-31', '003/SP/RUSTIC/VII/2025', 'PT BANK NEGARA INDONESIA (PERSERO) Tbk  Cabang KCP Sorowako', 'Permohonan Perubahan Spesimen Tanda Tangan', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Permohonan', '2025-08-27', '004/S0/RUSTIC/VIII/2025', 'Kepala Dinas Lingkungan Hidup Luwu Timur', 'Permintaan Bantuan Pohon Ketapang Kencana', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Kuasa', null, null, 'KP2KP Luwu Timur', 'Kuasa Mempelajari SPT Masa Coretax', '1', 'Direktur PT Rustika', null),
  ('KELUAR', 'Surat Perjanjian', '2025-06-16', '001/LSMT/VI/2025', 'Office Administration', 'Perjanjian Sewa Menyewa Kantor', '1', '- Komisaris PT Rustika    - Direktur PT Rustika', null),
  ('KELUAR', 'Surat Keputusan', '2026-05-05', '001/SK-DIR/RGI/V/2026', 'Komisaris PT Rustika', 'Surat Keputusan Direktur Utama', '3', null, null),
  ('KELUAR', 'Surat Keputusan', '2026-12-05', '002/SK/RGI/V/2026', 'Direktur PT Rustika', 'Pemberhentian Sementara Direktur PT Rustika Global Indonesia', '1', null, null),
  ('KELUAR', 'Surat Keputusan', '2026-12-05', '03/SK/RGI/V/2026', 'Direktur PT Rustika', 'Pemberhentian Sementara Direktur PT Rustika Citra Group', '1', null, null),
  ('KELUAR', 'Berita Acara', '2025-04-11', '001/RUSTIC-B/BA/4-XII/2025', 'CLIENT [MGA PRIVATE HOUSE]', 'Berita Acara Pergantian Shop Drawing', '2', null, null),
  ('KELUAR', 'Berita Acara', '2026-02-03', '002/RUSTIC-B/BA/2-III/2026', 'CLIENT [MGA PRIVATE HOUSE]', 'Berita Acara Approval Material', '2', null, null),
  ('KELUAR', 'Berita Acara', '2026-06-22', '003/RUSTIC-B/BA/VI/2026', 'PT Citra Lampia Mandiri', 'Berita Acara Penagihan Invoice 85% Progres', null, null, null),
  ('KELUAR', 'Surat Pemberitahuan', '2026-05-05', '004/SP/RUSTIC-B/V/2026', null, 'PEMBERITAHUAN DAN PENETAPAN REKENING RESMI PERUSAHAAN', null, null, null),
  ('KELUAR', 'Surat Pemberitahuan', '2026-05-19', '005/SP/RUSTIC-B/V/2026', null, 'SOMASI PEMBERITAHUAN PENYERAHAN ASET PERUSAHAAN', null, null, null);
