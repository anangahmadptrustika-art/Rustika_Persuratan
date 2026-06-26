import { put } from "@vercel/blob";
import { getBlobToken } from "../../../lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Upload via server: browser mengirim file (FormData) ke sini, lalu server
// menyimpannya ke Vercel Blob dan mengembalikan URL-nya. Lebih andal daripada
// client-upload (tidak bergantung pada webhook penyelesaian).
export async function POST(req) {
  const token = getBlobToken();
  if (!token) {
    console.error("[upload] Token Vercel Blob tidak ditemukan.");
    return Response.json(
      {
        error:
          "Penyimpanan file (Vercel Blob) belum aktif. Hubungkan Blob store " +
          "dan pastikan BLOB_READ_WRITE_TOKEN ada di Production.",
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
      access: "public",
      token,
      addRandomSuffix: true,
    });

    return Response.json({ url: blob.url, pathname: blob.pathname });
  } catch (err) {
    console.error("[upload] put gagal:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
