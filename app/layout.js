import "./globals.css";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { PERUSAHAAN } from "../lib/constants";

export const metadata = {
  title: "Aplikasi Persuratan — PT Rustika Global Indonesia",
  description:
    "Pencatatan dan arsip surat keluar & surat masuk PT Rustika Global Indonesia.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 flex flex-col">
        <header className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white shadow-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
            <Link
              href="/"
              className="bg-white text-blue-900 font-bold p-2 rounded-lg flex items-center justify-center shadow-inner"
              aria-label="Beranda"
            >
              <Building2 size={24} className="mr-1 hidden sm:block" />
              <span className="text-xl tracking-tight">RG</span>
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide">
                {PERUSAHAAN}
              </h1>
              <p className="text-xs text-blue-200">Aplikasi Persuratan</p>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-8">
          {children}
        </main>

        <footer className="py-6 text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} {PERUSAHAAN} — Arsip Persuratan
        </footer>
      </body>
    </html>
  );
}
