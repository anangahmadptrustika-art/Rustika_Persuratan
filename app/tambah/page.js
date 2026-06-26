"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  supabase,
  isSupabaseConfigured,
  TABLE,
  BUCKET,
} from "../../lib/supabaseClient";
import { KATEGORI, JENIS_SURAT } from "../../lib/constants";
import ConfigNotice from "../ConfigNotice";

function TambahForm() {
  const router = useRouter();
  const search = useSearchParams();
  const initialKategori = KATEGORI[search.get("kategori")] ? search.get("kategori") : "keluar";
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
      form.jenis_surat === "__lain__"
        ? form.jenis_lain.trim()
        : form.jenis_surat;

    if (!jenisFinal) {
      setError("Jenis surat wajib dipilih atau diisi.");
      return;
    }
    if (!form.perihal.trim()) {
      setError("Perihal surat wajib diisi.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Database belum dikonfigurasi. Lihat README.md.");
      return;
    }

    setSaving(true);
    try {
      let file_url = null;
      let file_path = null;

      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const path = `${form.kategori}/${Date.now()}_${safeName}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        file_path = path;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        file_url = pub.publicUrl;
      }

      const payload = {
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
      };

      const { error: insErr } = await supabase.from(TABLE).insert(payload);
      if (insErr) throw insErr;

      setSuccess(true);
      setTimeout(() => {
        router.push(
          `/surat/${form.kategori}/${encodeURIComponent(jenisFinal)}`
        );
      }, 700);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
      setSaving(false);
    }
  }

  const kategoriLabel = KATEGORI[form.kategori]?.label;

  return (
    <div>
      <Link
        href={`/surat/${form.kategori}`}
        className="back-link"
      >
        ← {kategoriLabel}
      </Link>
      <h1 className="page-title">Tambah Surat</h1>
      <p className="page-sub">Isi data surat lalu unggah dokumennya (opsional).</p>

      {!isSupabaseConfigured && <ConfigNotice />}
      {error && <div className="alert-error">{error}</div>}
      {success && (
        <div className="alert-success">✓ Surat berhasil disimpan! Mengalihkan…</div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Kategori <span className="req">*</span>
          </label>
          <select
            className="form-control"
            value={form.kategori}
            onChange={(e) => update("kategori", e.target.value)}
          >
            <option value="keluar">Surat Keluar</option>
            <option value="masuk">Surat Masuk</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Jenis Surat <span className="req">*</span>
          </label>
          <select
            className="form-control"
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
              className="form-control"
              style={{ marginTop: 8 }}
              placeholder="Tulis jenis surat baru"
              value={form.jenis_lain}
              onChange={(e) => update("jenis_lain", e.target.value)}
            />
          )}
        </div>

        <div className="form-group">
          <label>Tanggal Surat</label>
          <input
            type="date"
            className="form-control"
            value={form.tanggal_surat}
            onChange={(e) => update("tanggal_surat", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nomor Surat</label>
          <input
            className="form-control"
            placeholder="cth: 01/B-RUST/IX/2024"
            value={form.nomor_surat}
            onChange={(e) => update("nomor_surat", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tujuan Surat</label>
          <textarea
            className="form-control"
            placeholder="cth: Kepala Dinas PUPR Luwu Timur"
            value={form.tujuan_surat}
            onChange={(e) => update("tujuan_surat", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            Perihal <span className="req">*</span>
          </label>
          <textarea
            className="form-control"
            placeholder="cth: Surat Permohonan Kesesuaian Rencana Tata Ruang"
            value={form.perihal}
            onChange={(e) => update("perihal", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Lampiran</label>
          <input
            className="form-control"
            placeholder="cth: 1 berkas"
            value={form.lampiran}
            onChange={(e) => update("lampiran", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tembusan</label>
          <input
            className="form-control"
            placeholder="cth: Direktur PT Rustika"
            value={form.tembusan}
            onChange={(e) => update("tembusan", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Keterangan</label>
          <input
            className="form-control"
            placeholder="Catatan tambahan (opsional)"
            value={form.keterangan}
            onChange={(e) => update("keterangan", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Dokumen Surat (Word / PDF / gambar)</label>
          <div
            className="file-drop"
            onClick={() => fileRef.current?.click()}
          >
            {file ? (
              <span>Klik untuk mengganti file</span>
            ) : (
              <span>
                <strong>Pilih file</strong> untuk diunggah
              </span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <div className="file-chosen">
              📎 {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </div>
          )}
          <div className="help">
            Maksimal ±50 MB. Dokumen dibuat manual (Word) lalu diunggah di sini.
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={saving || success}
        >
          {saving ? (
            <>
              <span className="spin" /> Menyimpan…
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
    <Suspense fallback={<div className="page-sub">Memuat…</div>}>
      <TambahForm />
    </Suspense>
  );
}
