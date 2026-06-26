"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured, TABLE } from "../lib/supabaseClient";
import ConfigNotice from "./ConfigNotice";

export default function Home() {
  const [counts, setCounts] = useState({ KELUAR: null, MASUK: null });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    (async () => {
      const keluar = await supabase
        .from(TABLE)
        .select("id", { count: "exact", head: true })
        .eq("kategori", "KELUAR");
      const masuk = await supabase
        .from(TABLE)
        .select("id", { count: "exact", head: true })
        .eq("kategori", "MASUK");
      if (!active) return;
      setCounts({
        KELUAR: keluar.count ?? 0,
        MASUK: masuk.count ?? 0,
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

      {!isSupabaseConfigured && <ConfigNotice />}

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
