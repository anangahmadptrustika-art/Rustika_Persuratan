"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSurat } from "../lib/api";
import ConfigNotice from "./ConfigNotice";

export default function Home() {
  const [counts, setCounts] = useState({ KELUAR: null, MASUK: null });
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await getSurat();
      if (!active) return;
      if (res.configured === false) {
        setConfigured(false);
        setCounts({ KELUAR: 0, MASUK: 0 });
        return;
      }
      const data = res.data || [];
      setCounts({
        KELUAR: data.filter((s) => s.kategori === "KELUAR").length,
        MASUK: data.filter((s) => s.kategori === "MASUK").length,
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="page-title">Selamat datang 👋</h1>
      <p className="page-sub">
        Pilih kategori surat untuk melihat, menambah, atau membuka dokumen.
      </p>

      {!configured && <ConfigNotice />}

      <div className="home-grid">
        <Link href="/surat/keluar" className="big-card keluar">
          <div className="icon">📤</div>
          <div>
            <h2>Surat Keluar</h2>
            <p>Surat yang dikirim perusahaan ke pihak lain.</p>
          </div>
          <span className="count">
            {counts.KELUAR === null ? "Memuat…" : `${counts.KELUAR} surat`}
          </span>
        </Link>

        <Link href="/surat/masuk" className="big-card masuk">
          <div className="icon">📥</div>
          <div>
            <h2>Surat Masuk</h2>
            <p>Surat yang diterima perusahaan dari pihak lain.</p>
          </div>
          <span className="count">
            {counts.MASUK === null ? "Memuat…" : `${counts.MASUK} surat`}
          </span>
        </Link>
      </div>
    </div>
  );
}
