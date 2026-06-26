export default function ConfigNotice() {
  return (
    <div className="notice">
      <strong>⚙️ Aplikasi belum terhubung ke database</strong>
      Tambahkan integrasi <code>Neon Postgres</code> dan store{" "}
      <code>Vercel Blob</code> di project Vercel, sehingga env var{" "}
      <code>DATABASE_URL</code> dan <code>BLOB_READ_WRITE_TOKEN</code> terisi
      (lihat <code>README.md</code>). Setelah di-deploy ulang, data surat akan
      tampil di sini.
    </div>
  );
}
