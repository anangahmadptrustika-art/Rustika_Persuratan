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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          Selamat datang <span className="animate-bounce origin-bottom">👋</span>
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
          className="group relative bg-white rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100 overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
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
          className="group relative bg-white rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100 overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
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
