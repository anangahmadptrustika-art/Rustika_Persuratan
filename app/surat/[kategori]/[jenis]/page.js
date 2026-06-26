"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  FileText,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>

      <div className="p-5 sm:p-6 pl-6 sm:pl-8">
        <div className="flex justify-between items-start gap-3 mb-4">
          <span className="inline-block bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-md text-sm border border-slate-200 break-all">
            {surat.nomor_surat || "(tanpa nomor)"}
          </span>
          <span className="shrink-0 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap">
            {formatTanggal(surat.tanggal_surat)}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Perihal
            </h5>
            <p className="text-slate-800 font-medium">{surat.perihal || "-"}</p>
          </div>

          <div>
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tujuan Surat
            </h5>
            <p className="text-slate-600 text-sm leading-relaxed">
              {surat.tujuan_surat || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Lampiran
              </h5>
              <p className="text-slate-600 text-sm">{surat.lampiran || "-"}</p>
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Tembusan
              </h5>
              <p className="text-slate-600 text-sm">{surat.tembusan || "-"}</p>
            </div>
          </div>

          {surat.keterangan ? (
            <div>
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Keterangan
              </h5>
              <p className="text-slate-600 text-sm">{surat.keterangan}</p>
            </div>
          ) : null}
        </div>

        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFile}
        />

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
          {surat.file_url ? (
            <>
              <a
                href={surat.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink size={16} /> Lihat Dokumen
              </a>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {uploading ? "Mengunggah…" : "Ganti Dokumen"}
              </button>
            </>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? "Mengunggah…" : "Unggah Dokumen"}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <Trash2 size={16} /> {deleting ? "Menghapus…" : "Hapus"}
          </button>
        </div>
      </div>
    </div>
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
    <div className="animate-in fade-in slide-in-from-right-8 duration-300 pb-20">
      <Link
        href={`/surat/${slug}`}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors w-fit"
      >
        <ArrowLeft size={18} className="mr-1" /> {kategori.label}
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl hidden sm:block">
          <FileText size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{jenis}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {kategori.label} • {rows === null ? "memuat…" : `${rows.length} surat`}
          </p>
        </div>
      </div>

      {!configured && (
        <div className="mb-6">
          <ConfigNotice />
        </div>
      )}
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">
          Gagal memuat data: {error}
        </div>
      )}

      {rows === null ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-3 opacity-50">🗂️</div>
          <p className="mb-1">Belum ada surat untuk jenis ini.</p>
          <p className="text-sm">Tekan tombol “Tambah Surat” untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-4">
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
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
      >
        <Plus size={20} /> Tambah Surat
      </Link>
    </div>
  );
}
