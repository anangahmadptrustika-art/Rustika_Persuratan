import { isDbConfigured } from "../../../lib/db";
import { getBlobToken } from "../../../lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  // Diagnostik AMAN: hanya menampilkan NAMA env var terkait penyimpanan
  // (tanpa nilainya), untuk memastikan token Blob benar-benar ada.
  const relatedKeys = Object.keys(process.env)
    .filter((k) => /BLOB|TOKEN|POSTGRES|DATABASE|NEON/i.test(k))
    .sort();

  return Response.json({
    db: isDbConfigured,
    blob: Boolean(getBlobToken()),
    envKeys: relatedKeys,
  });
}
