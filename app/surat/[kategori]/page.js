"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getSurat } from "../../../lib/api";
import { KATEGORI, JENIS_SURAT } from "../../../lib/constants";
import ConfigNotice from "../../ConfigNotice";

export default function KategoriPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.kategori;
  const kategori = KATEGORI[slug];

  const [rows, setRows] = useState(null); // null = loading
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!kategori) {
      router.replace("/");
      return;
    }
    let active = true;
    (async () => {
      const res = await getSurat({ kategori: kategori.value });
      if (!active) return;
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
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (!kategori) return null;

  const counts = {};
  (rows || []).forEach((r) => {
    const j = r.jenis_surat || "Lainnya";
    counts[j] = (counts[j] || 0) + 1;
  });
  const allJenis = Array.from(new Set([...JENIS_SURAT, ...Object.keys(counts)]));

  return (
    <div>
      <Link href="/" className="back-link">
        ← Beranda
      </Link>
      <h1 className="page-title">{kategori.label}</h1>
      <p className="page-sub">Pilih jenis surat untuk melihat daftarnya.</p>

      {!configured && <ConfigNotice />}
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
