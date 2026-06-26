// Mencari token Vercel Blob dari environment.
//
// Saat sebuah Blob store diberi nama (mis. "rustika-persuratan-blob"),
// Vercel kadang menyuntikkan token dengan nama env var BER-PREFIX
// (mis. rustika_persuratan_blob_READ_WRITE_TOKEN) — bukan
// BLOB_READ_WRITE_TOKEN yang dicari otomatis oleh SDK @vercel/blob.
//
// Nilai token Blob SELALU berawalan "vercel_blob_rw_", jadi kita cari
// berdasarkan pola nilainya agar tidak bergantung pada nama variabelnya.
export function getBlobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return process.env.BLOB_READ_WRITE_TOKEN;
  }
  for (const value of Object.values(process.env)) {
    if (typeof value === "string" && value.startsWith("vercel_blob_rw_")) {
      return value;
    }
  }
  return null;
}
