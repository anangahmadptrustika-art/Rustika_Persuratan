import { put } from "@vercel/blob";
import { getBlobToken } from "../../../lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Upload via server ke Vercel Blob (store PRIVATE). File ditampilkan lewat
// proxy /api/file agar bisa dibuka tanpa login.
export async function POST(req) {
  const token = getBlobToken();
  if (!token) {
    console.error("[upload] Token Vercel Blob tidak ditemukan.");
    return Response.json(
      {
        error:
          "Penyimpanan file (Vercel Blob) belum aktif. Pastikan " +
          "BLOB_READ_WRITE_TOKEN ada di environment Production.",
      },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const kategori = (formData.get("kategori") || "umum").toString();

    if (!file || typeof file === "string") {
      return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    const safeName = (file.name || "dokumen").replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const blob = await put(`${kategori}/${Date.now()}_${safeName}`, file, {
      access: "private",
      token,
      addRandomSuffix: true,
    });

    // url = link tampil (proxy), pathname = URL blob asli (untuk hapus)
    const viewUrl = `/api/file?src=${encodeURIComponent(blob.url)}`;
    return Response.json({ url: viewUrl, pathname: blob.url });
  } catch (err) {
    console.error("[upload] put gagal:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
