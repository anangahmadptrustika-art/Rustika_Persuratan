import { getBlobToken } from "../../../lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Menyalurkan (proxy) file dari Vercel Blob store PRIVATE ke browser,
// menggunakan token di sisi server. Dengan begitu dokumen bisa dibuka
// tanpa login, tapi store tetap privat.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src");

  // Hanya izinkan URL milik Vercel Blob (cegah disalahgunakan jadi proxy umum).
  if (!src || !/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(src)) {
    return new Response("Permintaan tidak valid", { status: 400 });
  }

  const token = getBlobToken();
  if (!token) {
    return new Response("Penyimpanan belum dikonfigurasi", { status: 500 });
  }

  const upstream = await fetch(src, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!upstream.ok) {
    return new Response("Dokumen tidak ditemukan", { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") || "application/octet-stream"
  );
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  // Tampilkan langsung di browser bila bisa (PDF/gambar), kalau tidak diunduh.
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "private, max-age=0, must-revalidate");

  return new Response(upstream.body, { status: 200, headers });
}
