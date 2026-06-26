"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured, TABLE } from "../../../lib/supabaseClient";
import { KATEGORI, JENIS_SURAT } from "../../../lib/constants";
import ConfigNotice from "../../ConfigNotice";

export default function KategoriPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.kategori;
  const kategori = KATEGORI[slug];

  const [rows, setRows] = useState(null); // null = loading
  const [error, setError] = useState("");

  useEffect(() => {
    if (!kategori) {
      router.replace("/");
      return;
    }
    if (!isSupabaseConfigured) {
      setRows([]);
      return;
    }
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("jenis_surat")
        .eq("kategori", kategori.value);
      if (!active) return;
      if (error) {
        setError(error.message);
        setRows([]);
        return;
      }
      setRows(data || []);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (!kategori) return null;

  // Hitung jumlah surat per jenis
  const counts = {};
  (rows || []).forEach((r) => {
    const j = r.jenis_surat || "Lainnya";
    counts[j] = (counts[j] || 0) + 1;
  });
  // Gabungkan jenis bawaan + jenis lain yang sudah ada di data
  const allJenis = Array.from(
    new Set([...JENIS_SURAT, ...Object.keys(counts)])
  );

  return (
    <div>
      <Link href="/" className="back-link">
        ← Beranda
      </Link>
      <h1 className="page-title">{kategori.label}</h1>
      <p className="page-sub">Pilih jenis surat untuk melihat daftarnya.</p>

      {!isSupabaseConfigured && <ConfigNotice />}
      {error && <div className="alert-error">Gagal memuat data: {error}</div>}

      {rows === null ? (
        <div className="list">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : (
        <div className="list">
          {allJenis.map((jenis) => (
            <Link
              key={jenis}
              href={`/surat/${slug}/${encodeURIComponent(jenis)}`}
              className="row-card"
            >
              <div className="r-icon">📄</div>
              <div className="r-body">
                <div className="r-title">{jenis}</div>
                <div className="r-meta">
                  {counts[jenis] ? `${counts[jenis]} surat` : "Belum ada surat"}
                </div>
              </div>
              <span className="badge">{counts[jenis] || 0}</span>
              <span className="chev">›</span>
            </Link>
          ))}
        </div>
      )}

      <Link href={`/tambah?kategori=${slug}`} className="fab">
        + Tambah Surat
      </Link>
    </div>
  );
}
