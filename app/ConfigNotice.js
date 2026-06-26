export default function ConfigNotice() {
  return (
    <div className="notice">
      <strong>⚙️ Aplikasi belum terhubung ke database</strong>
      Atur environment variable <code>NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
      <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (lihat <code>README.md</code>).
      Setelah diisi dan aplikasi di-deploy ulang, data surat akan tampil di sini.
    </div>
  );
}
