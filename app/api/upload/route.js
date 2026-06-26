import { handleUpload } from "@vercel/blob/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Menangani unggahan file langsung dari browser ke Vercel Blob
// (client upload) sehingga file besar tidak terbatas limit body serverless.
export async function POST(req) {
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
    return Response.json({ error: err.message }, { status: 400 });
  }
}
