export default function ConfigNotice() {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm leading-relaxed">
      <strong className="block mb-1">⚙️ Aplikasi belum terhubung ke database</strong>
      Tambahkan integrasi{" "}
      <code className="bg-black/5 px-1.5 py-0.5 rounded text-xs">Neon Postgres</code>{" "}
      dan store{" "}
      <code className="bg-black/5 px-1.5 py-0.5 rounded text-xs">Vercel Blob</code>{" "}
      di project Vercel (env <code className="bg-black/5 px-1.5 py-0.5 rounded text-xs">DATABASE_URL</code>{" "}
      &amp; <code className="bg-black/5 px-1.5 py-0.5 rounded text-xs">BLOB_READ_WRITE_TOKEN</code>),
      lalu deploy ulang.
    </div>
  );
}
