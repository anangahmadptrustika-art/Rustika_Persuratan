import { isDbConfigured } from "../../../lib/db";
import { getBlobToken } from "../../../lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    db: isDbConfigured,
    blob: Boolean(getBlobToken()),
  });
}
