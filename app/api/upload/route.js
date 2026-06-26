import { handleUpload } from "@vercel/blob/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Menangani unggahan file langsung dari browser ke Vercel Blob
// (client upload) sehingga file besar tidak terbatas limit body serverless.
export async function POST(req) {
  // Cek token Blob lebih dulu agar pesan errornya jelas.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[upload] BLOB_READ_WRITE_TOKEN tidak ditemukan di environment.");
    return Response.json(
      {
        error:
          "Penyimpanan file (Vercel Blob) belum aktif: BLOB_READ_WRITE_TOKEN kosong. " +
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
