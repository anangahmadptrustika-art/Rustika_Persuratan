"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { getSurat, deleteSurat, updateSuratFile } from "../../../../lib/api";
import { KATEGORI, formatTanggal } from "../../../../lib/constants";
import ConfigNotice from "../../../ConfigNotice";

function SuratCard({ surat, slug, onChange, onDelete }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const blob = await upload(`${slug}/${Date.now()}_${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      const updated = await updateSuratFile(surat.id, blob.url, blob.pathname);
      onChange(updated);
    } catch (err) {
      setError(err.message || "Gagal mengunggah dokumen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!confirm(`Hapus surat "${surat.perihal || surat.nomor_surat}"?`)) return;
    setDeleting(true);
    try {
      await deleteSurat(surat.id);
      onDelete(surat.id);
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
      setDeleting(false);
    }
  }

  return (
    <article className="surat-card">
      <div className="s-top">
        <div className="s-no">{surat.nomor_surat || "(tanpa nomor)"}</div>
        <div className="s-date">{formatTanggal(surat.tanggal_surat)}</div>
      </div>

      <div className="field">
        <div className="f-label">Perihal</div>
        <div className="f-value">{surat.perihal || "-"}</div>
      </div>
      <div className="field">
        <div className="f-label">Tujuan Surat</div>
        <div className="f-value">{surat.tujuan_surat || "-"}</div>
      </div>
      {surat.lampiran ? (
        <div className="field">
          <div className="f-label">Lampiran</div>
          <div className="f-value">{surat.lampiran}</div>
        </div>
      ) : null}
      {surat.tembusan ? (
        <div className="field">
          <div className="f-label">Tembusan</div>
          <div className="f-value">{surat.tembusan}</div>
        </div>
      ) : null}
      {surat.keterangan ? (
        <div className="field">
          <div className="f-label">Keterangan</div>
          <div className="f-value">{surat.keterangan}</div>
        </div>
      ) : null}

      {error && (
        <div className="alert-error" style={{ marginTop: 12, marginBottom: 0 }}>
          {error}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <div className="s-actions">
        {surat.file_url ? (
          <>
            <a
              href={surat.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              📎 Lihat Dokumen
            </a>
            <button
              className="btn btn-outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Mengunggah…" : "Ganti Dokumen"}
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="spin" /> Mengunggah…
              </>
            ) : (
              "⬆️ Unggah Dokumen"
            )}
          </button>
        )}
        <button
          className="btn btn-ghost"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Menghapus…" : "Hapus"}
        </button>
      </div>
    </article>
  );
}

export default function JenisPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.kategori;
  const jenis = decodeURIComponent(params.jenis || "");
  const kategori = KATEGORI[slug];

  const [rows, setRows] = useState(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const res = await getSurat({ kategori: kategori.value, jenis });
    if (res.configured === false) {
      setConfigured(false);
      setRows([]);
      return;
    }
    if (res.error) {
      setError(res.error);
      setRows([]);
      return;
    }
    setRows(res.data || []);
  }

  useEffect(() => {
    if (!kategori) {
      router.replace("/");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, jenis]);

  function handleCardChange(updated) {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }
  function handleCardDelete(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  if (!kategori) return null;

  return (
    <div>
      <Link href={`/surat/${slug}`} className="back-link">
        ← {kategori.label}
      </Link>
      <h1 className="page-title">{jenis}</h1>
      <p className="page-sub">
        {kategori.label} · {rows === null ? "memuat…" : `${rows.length} surat`}
      </p>

      {!configured && <ConfigNotice />}
      {error && <div className="alert-error">Gagal memuat data: {error}</div>}

      {rows === null ? (
        <div className="list">
          <div className="skeleton" style={{ height: 140 }} />
          <div className="skeleton" style={{ height: 140 }} />
        </div>
      ) : rows.length === 0 ? (
        <div className="empty">
          <div className="e-icon">🗂️</div>
          <p>Belum ada surat untuk jenis ini.</p>
          <p style={{ fontSize: 13 }}>
            Tekan tombol “Tambah Surat” untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="list">
          {rows.map((s) => (
            <SuratCard
              key={s.id}
              surat={s}
              slug={slug}
              onChange={handleCardChange}
              onDelete={handleCardDelete}
            />
          ))}
        </div>
      )}

      <Link
        href={`/tambah?kategori=${slug}&jenis=${encodeURIComponent(jenis)}`}
        className="fab"
      >
        + Tambah Surat
      </Link>
    </div>
  );
}
