"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getSurat, deleteSurat } from "../../../../lib/api";
import { KATEGORI, formatTanggal } from "../../../../lib/constants";
import ConfigNotice from "../../../ConfigNotice";

export default function JenisPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.kategori;
  const jenis = decodeURIComponent(params.jenis || "");
  const kategori = KATEGORI[slug];

  const [rows, setRows] = useState(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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

  async function handleDelete(row) {
    if (!confirm(`Hapus surat "${row.perihal || row.nomor_surat}"?`)) return;
    setDeletingId(row.id);
    try {
      await deleteSurat(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    } finally {
      setDeletingId(null);
    }
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
            <article key={s.id} className="surat-card">
              <div className="s-top">
                <div className="s-no">{s.nomor_surat || "(tanpa nomor)"}</div>
                <div className="s-date">{formatTanggal(s.tanggal_surat)}</div>
              </div>

              <div className="field">
                <div className="f-label">Perihal</div>
                <div className="f-value">{s.perihal || "-"}</div>
              </div>
              <div className="field">
                <div className="f-label">Tujuan Surat</div>
                <div className="f-value">{s.tujuan_surat || "-"}</div>
              </div>
              {s.lampiran ? (
                <div className="field">
                  <div className="f-label">Lampiran</div>
                  <div className="f-value">{s.lampiran}</div>
                </div>
              ) : null}
              {s.tembusan ? (
                <div className="field">
                  <div className="f-label">Tembusan</div>
                  <div className="f-value">{s.tembusan}</div>
                </div>
              ) : null}
              {s.keterangan ? (
                <div className="field">
                  <div className="f-label">Keterangan</div>
                  <div className="f-value">{s.keterangan}</div>
                </div>
              ) : null}

              <div className="s-actions">
                {s.file_url ? (
                  <a
                    href={s.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    📎 Lihat Dokumen
                  </a>
                ) : (
                  <span className="btn btn-ghost" style={{ cursor: "default" }}>
                    Tidak ada dokumen
                  </span>
                )}
                <button
                  className="btn btn-outline"
                  onClick={() => handleDelete(s)}
                  disabled={deletingId === s.id}
                >
                  {deletingId === s.id ? "Menghapus…" : "Hapus"}
                </button>
              </div>
            </article>
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
