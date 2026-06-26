"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import { getSurat } from "../../../lib/api";
import { KATEGORI, JENIS_SURAT, JENIS_META, JENIS_META_DEFAULT } from "../../../lib/constants";
import { resolveJenisIcon } from "../../../lib/icons";
import ConfigNotice from "../../ConfigNotice";

export default function KategoriPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.kategori;
  const kategori = KATEGORI[slug];

  const [rows, setRows] = useState(null);
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
    <div className="animate-in fade-in slide-in-from-right-8 duration-300 pb-20">
      <Link
        href="/"
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors w-fit"
      >
        <ArrowLeft size={18} className="mr-1" /> Beranda
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{kategori.label}</h2>
        <p className="text-slate-500 text-sm mt-1">
          Pilih jenis surat untuk melihat daftarnya.
        </p>
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
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[72px] rounded-xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {allJenis.map((jenis) => {
            const meta = JENIS_META[jenis] || JENIS_META_DEFAULT;
            const Icon = resolveJenisIcon(meta.icon);
            return (
              <Link
                key={jenis}
                href={`/surat/${slug}/${encodeURIComponent(jenis)}`}
                className="w-full bg-white rounded-xl p-4 flex items-center justify-between border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${meta.bg} ${meta.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                      {jenis}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {counts[jenis] ? `${counts[jenis]} surat` : "Belum ada surat"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors group-hover:translate-x-1 duration-300"
                />
              </Link>
            );
          })}
        </div>
      )}

      <Link
        href={`/tambah?kategori=${slug}`}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
      >
        <Plus size={20} /> Tambah Surat
      </Link>
    </div>
  );
}
