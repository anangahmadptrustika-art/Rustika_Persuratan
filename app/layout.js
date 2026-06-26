import "./globals.css";
import Link from "next/link";
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
      <body>
        <header className="app-header">
          <div className="bar">
            <Link href="/" className="logo" aria-label="Beranda">
              RG
            </Link>
            <div>
              <h1>{PERUSAHAAN}</h1>
              <p>Aplikasi Persuratan</p>
            </div>
          </div>
        </header>
        <main className="container">{children}</main>
        <div className="footer">
          © {new Date().getFullYear()} {PERUSAHAAN} · Arsip Persuratan
        </div>
      </body>
    </html>
  );
}
