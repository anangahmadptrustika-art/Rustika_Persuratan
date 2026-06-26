// Daftar jenis surat (diambil dari file Excel PT Rustika Global Indonesia).
// "Lainnya" memungkinkan menambah jenis surat baru yang belum terdaftar.
export const JENIS_SURAT = [
  "Surat Permohonan",
  "Surat Kuasa",
  "Surat Perjanjian",
  "Surat Keputusan",
  "Berita Acara",
  "Surat Pemberitahuan",
];

export const KATEGORI = {
  keluar: { slug: "keluar", value: "KELUAR", label: "Surat Keluar" },
  masuk: { slug: "masuk", value: "MASUK", label: "Surat Masuk" },
};

export const PERUSAHAAN = "PT RUSTIKA GLOBAL INDONESIA";

// Format tanggal Indonesia: 24 Juli 2025
export function formatTanggal(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}
