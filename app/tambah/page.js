"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Paperclip, CheckCircle2 } from "lucide-react";
import { createSurat, uploadFile } from "../../lib/api";
import { KATEGORI, JENIS_SURAT } from "../../lib/constants";

const inputClass =
  "w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass = "block text-sm font-bold text-slate-700 mb-1.5";

function TambahForm() {
  const router = useRouter();
  const search = useSearchParams();
  const initialKategori = KATEGORI[search.get("kategori")]
    ? search.get("kategori")
    : "keluar";
  const initialJenis = search.get("jenis") || "";

  const fileRef = useRef(null);
  const [form, setForm] = useState({
    kategori: initialKategori,
    jenis_surat: initialJenis,
    jenis_lain: "",
    tanggal_surat: "",
    nomor_surat: "",
    tujuan_surat: "",
    perihal: "",
    lampiran: "",
    tembusan: "",
    keterangan: "",
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const jenisFinal =
      form.jenis_surat === "__lain__" ? form.jenis_lain.trim() : form.jenis_surat;

    if (!jenisFinal) {
      setError("Jenis surat wajib dipilih atau diisi.");
      return;
    }
    if (!form.perihal.trim()) {
      setError("Perihal surat wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      let file_url = null;
      let file_path = null;

      if (file) {
        const blob = await uploadFile(file, form.kategori);
        file_url = blob.url;
        file_path = blob.pathname;
      }

      await createSurat({
        kategori: KATEGORI[form.kategori].value,
        jenis_surat: jenisFinal,
        tanggal_surat: form.tanggal_surat || null,
        nomor_surat: form.nomor_surat.trim() || null,
        tujuan_surat: form.tujuan_surat.trim() || null,
        perihal: form.perihal.trim(),
        lampiran: form.lampiran.trim() || null,
        tembusan: form.tembusan.trim() || null,
        keterangan: form.keterangan.trim() || null,
        file_url,
        file_path,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/surat/${form.kategori}/${encodeURIComponent(jenisFinal)}`);
      }, 700);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
      setSaving(false);
    }
  }

  const kategoriLabel = KATEGORI[form.kategori]?.label;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link
        href={`/surat/${form.kategori}`}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors w-fit"
      >
        <ArrowLeft size={18} className="mr-1" /> {kategoriLabel}
      </Link>

      <h2 className="text-2xl font-bold text-slate-800">Tambah Surat</h2>
      <p className="text-slate-500 text-sm mt-1 mb-6">
        Isi data surat lalu unggah dokumennya (opsional).
      </p>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
          <CheckCircle2 size={18} /> Surat berhasil disimpan! Mengalihkan…
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
      >
        <div>
          <label className={labelClass}>
            Kategori <span className="text-rose-500">*</span>
          </label>
          <select
            className={inputClass}
            value={form.kategori}
            onChange={(e) => update("kategori", e.target.value)}
          >
            <option value="keluar">Surat Keluar</option>
            <option value="masuk">Surat Masuk</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Jenis Surat <span className="text-rose-500">*</span>
          </label>
          <select
            className={inputClass}
            value={form.jenis_surat}
            onChange={(e) => update("jenis_surat", e.target.value)}
          >
            <option value="">— Pilih jenis surat —</option>
            {JENIS_SURAT.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
            <option value="__lain__">Lainnya (tulis sendiri)…</option>
          </select>
          {form.jenis_surat === "__lain__" && (
            <input
              className={`${inputClass} mt-2`}
              placeholder="Tulis jenis surat baru"
              value={form.jenis_lain}
              onChange={(e) => update("jenis_lain", e.target.value)}
            />
          )}
        </div>

        <div>
          <label className={labelClass}>Tanggal Surat</label>
          <input
            type="date"
            className={inputClass}
            value={form.tanggal_surat}
            onChange={(e) => update("tanggal_surat", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Nomor Surat</label>
          <input
            className={inputClass}
            placeholder="cth: 01/B-RUST/IX/2024"
            value={form.nomor_surat}
            onChange={(e) => update("nomor_surat", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Tujuan Surat</label>
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="cth: Kepala Dinas PUPR Luwu Timur"
            value={form.tujuan_surat}
            onChange={(e) => update("tujuan_surat", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>
            Perihal <span className="text-rose-500">*</span>
          </label>
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="cth: Surat Permohonan Kesesuaian Rencana Tata Ruang"
            value={form.perihal}
            onChange={(e) => update("perihal", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Lampiran</label>
            <input
              className={inputClass}
              placeholder="cth: 1 berkas"
              value={form.lampiran}
              onChange={(e) => update("lampiran", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Tembusan</label>
            <input
              className={inputClass}
              placeholder="cth: Direktur PT Rustika"
              value={form.tembusan}
              onChange={(e) => update("tembusan", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Keterangan</label>
          <input
            className={inputClass}
            placeholder="Catatan tambahan (opsional)"
            value={form.keterangan}
            onChange={(e) => update("keterangan", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Dokumen Surat (Word / PDF / gambar)</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-slate-300 rounded-lg p-5 text-center text-sm text-slate-500 cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
          >
            {file ? (
              <span>Klik untuk mengganti file</span>
            ) : (
              <span>
                <strong className="text-blue-600">Pilih file</strong> untuk diunggah
              </span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <div className="mt-2 text-sm text-slate-700 font-medium flex items-center gap-1.5">
              <Paperclip size={14} /> {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </div>
          )}
          <p className="text-xs text-slate-400 mt-1.5">
            Maksimal ±4 MB. Dokumen dibuat manual (Word) lalu diunggah di sini.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || success}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Menyimpan…
            </>
          ) : (
            "Simpan Surat"
          )}
        </button>
      </form>
    </div>
  );
}

export default function TambahPage() {
  return (
    <Suspense
      fallback={<div className="text-slate-500 text-sm">Memuat…</div>}
    >
      <TambahForm />
    </Suspense>
  );
}
