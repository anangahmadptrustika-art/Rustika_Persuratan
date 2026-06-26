import { isDbConfigured } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    db: isDbConfigured,
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}
