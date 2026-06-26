"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send, Inbox } from "lucide-react";
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          Selamat datang <span>👋</span>
        </h2>
        <p className="text-slate-500 mt-2">
          Pilih kategori surat untuk melihat, menambah, atau membuka dokumen.
        </p>
      </div>

      {!configured && (
        <div className="mb-6">
          <ConfigNotice />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Surat Keluar */}
        <Link
          href="/surat/keluar"
          className="group bg-white rounded-2xl p-8 text-left transition-shadow duration-200 hover:shadow-lg border border-slate-100"
        >
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm">
            <Send size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
            Surat Keluar
          </h3>
          <p className="text-slate-500 mb-6 text-sm">
            Surat yang dikirim perusahaan ke pihak lain.
          </p>
          <div className="text-blue-600 font-semibold bg-blue-50 inline-block px-3 py-1 rounded-full text-sm">
            {counts.KELUAR === null ? "Memuat…" : `${counts.KELUAR} surat`}
          </div>
        </Link>

        {/* Surat Masuk */}
        <Link
          href="/surat/masuk"
          className="group bg-white rounded-2xl p-8 text-left transition-shadow duration-200 hover:shadow-lg border border-slate-100"
        >
          <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 shadow-sm">
            <Inbox size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
            Surat Masuk
          </h3>
          <p className="text-slate-500 mb-6 text-sm">
            Surat yang diterima perusahaan dari pihak lain.
          </p>
          <div className="text-slate-600 font-semibold bg-slate-100 inline-block px-3 py-1 rounded-full text-sm">
            {counts.MASUK === null ? "Memuat…" : `${counts.MASUK} surat`}
          </div>
        </Link>
      </div>
    </div>
  );
}
