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

// Warna & ikon (nama ikon lucide-react) per jenis surat.
export const JENIS_META = {
  "Surat Permohonan": { icon: "FileText", color: "text-blue-500", bg: "bg-blue-50" },
  "Surat Kuasa": { icon: "FileSignature", color: "text-amber-500", bg: "bg-amber-50" },
  "Surat Perjanjian": { icon: "BookOpen", color: "text-emerald-500", bg: "bg-emerald-50" },
  "Surat Keputusan": { icon: "FileCheck2", color: "text-purple-500", bg: "bg-purple-50" },
  "Berita Acara": { icon: "FileText", color: "text-rose-500", bg: "bg-rose-50" },
  "Surat Pemberitahuan": { icon: "Info", color: "text-cyan-500", bg: "bg-cyan-50" },
};

export const JENIS_META_DEFAULT = {
  icon: "FileText",
  color: "text-slate-500",
  bg: "bg-slate-100",
};

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
