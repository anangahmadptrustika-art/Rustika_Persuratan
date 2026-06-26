import { handleUpload } from "@vercel/blob/client";
import { getBlobToken } from "../../../lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Menangani unggahan file langsung dari browser ke Vercel Blob
// (client upload) sehingga file besar tidak terbatas limit body serverless.
export async function POST(req) {
  const token = getBlobToken();

  // Cek token Blob lebih dulu agar pesan errornya jelas.
  if (!token) {
    const blobKeys = Object.keys(process.env).filter((k) =>
      k.toUpperCase().includes("BLOB")
    );
    console.error(
      "[upload] Token Vercel Blob tidak ditemukan. Env var mengandung 'BLOB':",
      blobKeys
    );
    return Response.json(
      {
        error:
          "Penyimpanan file (Vercel Blob) belum aktif: token tidak ditemukan. " +
          "Hubungkan Blob store ke project lalu Redeploy.",
      },
      { status: 400 }
    );
  }

  const body = await req.json();
  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      token, // pakai token yang terdeteksi (apa pun nama env var-nya)
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
        ],
        maximumSizeInBytes: 50 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        // tidak ada aksi tambahan; URL disimpan oleh client lewat /api/surat
      },
    });
    return Response.json(jsonResponse);
  } catch (err) {
    console.error("[upload] handleUpload gagal:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
