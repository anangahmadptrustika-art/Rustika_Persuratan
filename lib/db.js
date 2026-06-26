import { neon } from "@neondatabase/serverless";
import { SEED_SURAT } from "./seedData";

// Mendukung beberapa nama env var yang dipakai integrasi Neon / Vercel Postgres.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  null;

export const isDbConfigured = Boolean(connectionString);

export const sql = isDbConfigured ? neon(connectionString) : null;

let schemaPromise = null;

// Membuat tabel saat pertama kali, lengkap dengan data awal dari Excel.
// Idempotent: tabel hanya dibuat & di-seed kalau belum ada.
export async function ensureSchema() {
  if (!sql) return;
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const reg = await sql`select to_regclass('public.surat') as t`;
      const tableExists = reg[0]?.t !== null && reg[0]?.t !== undefined;

      await sql`
        create table if not exists surat (
          id            uuid primary key default gen_random_uuid(),
          kategori      text not null,
          jenis_surat   text not null,
          tanggal_surat date,
          nomor_surat   text,
          tujuan_surat  text,
          perihal       text not null,
          lampiran      text,
          tembusan      text,
          keterangan    text,
          file_url      text,
          file_path     text,
          created_at    timestamptz not null default now()
        )
      `;
      await sql`create index if not exists surat_kategori_idx on surat (kategori)`;
      await sql`create index if not exists surat_jenis_idx on surat (kategori, jenis_surat)`;

      // Seed hanya saat tabel benar-benar baru dibuat.
      if (!tableExists) {
        for (const s of SEED_SURAT) {
          await sql`
            insert into surat
              (kategori, jenis_surat, tanggal_surat, nomor_surat, tujuan_surat, perihal, lampiran, tembusan, keterangan)
            values
              (${s.kategori}, ${s.jenis_surat}, ${s.tanggal_surat}, ${s.nomor_surat},
               ${s.tujuan_surat}, ${s.perihal}, ${s.lampiran}, ${s.tembusan}, ${s.keterangan})
          `;
        }
      }
    })().catch((err) => {
      // reset agar percobaan berikutnya bisa mencoba lagi
      schemaPromise = null;
      throw err;
    });
  }
  return schemaPromise;
}
