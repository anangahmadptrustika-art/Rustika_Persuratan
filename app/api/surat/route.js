import { sql, ensureSchema, isDbConfigured } from "../../../lib/db";
import { del } from "@vercel/blob";
import { getBlobToken } from "../../../lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/surat?kategori=KELUAR&jenis=Surat%20Permohonan
export async function GET(req) {
  if (!isDbConfigured) {
    return Response.json({ configured: false, data: [] });
  }
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");
    const jenis = searchParams.get("jenis");

    let data;
    if (kategori && jenis) {
      data = await sql`
        select * from surat
        where kategori = ${kategori} and jenis_surat = ${jenis}
        order by tanggal_surat asc nulls first, created_at asc
      `;
    } else if (kategori) {
      data = await sql`
        select * from surat
        where kategori = ${kategori}
        order by created_at asc
      `;
    } else {
      data = await sql`select * from surat order by created_at asc`;
    }
    return Response.json({ configured: true, data });
  } catch (err) {
    return Response.json({ configured: true, error: err.message }, { status: 500 });
  }
}

// POST /api/surat  (body: data surat)
export async function POST(req) {
  if (!isDbConfigured) {
    return Response.json(
      { error: "Database belum dikonfigurasi (DATABASE_URL kosong)." },
      { status: 400 }
    );
  }
  try {
    await ensureSchema();
    const b = await req.json();
    if (!b.kategori || !b.jenis_surat || !b.perihal) {
      return Response.json(
        { error: "Kategori, jenis surat, dan perihal wajib diisi." },
        { status: 400 }
      );
    }
    const rows = await sql`
      insert into surat
        (kategori, jenis_surat, tanggal_surat, nomor_surat, tujuan_surat,
         perihal, lampiran, tembusan, keterangan, file_url, file_path)
      values
        (${b.kategori}, ${b.jenis_surat}, ${b.tanggal_surat || null},
         ${b.nomor_surat || null}, ${b.tujuan_surat || null}, ${b.perihal},
         ${b.lampiran || null}, ${b.tembusan || null}, ${b.keterangan || null},
         ${b.file_url || null}, ${b.file_path || null})
      returning *
    `;
    return Response.json({ data: rows[0] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/surat  (body: { id, file_url, file_path })
// Memperbarui dokumen sebuah surat yang sudah ada.
export async function PATCH(req) {
  if (!isDbConfigured) {
    return Response.json({ error: "Database belum dikonfigurasi." }, { status: 400 });
  }
  try {
    await ensureSchema();
    const b = await req.json();
    if (!b.id) {
      return Response.json({ error: "id wajib diisi." }, { status: 400 });
    }
    // Hapus file lama bila diganti dengan file baru yang berbeda.
    const existing = await sql`select file_url from surat where id = ${b.id}`;
    const oldUrl = existing[0]?.file_url;
    if (oldUrl && b.file_url && oldUrl !== b.file_url) {
      try {
        await del(oldUrl, { token: getBlobToken() });
      } catch (e) {
        // abaikan kalau file lama sudah tidak ada
      }
    }
    const rows = await sql`
      update surat
      set file_url = ${b.file_url || null}, file_path = ${b.file_path || null}
      where id = ${b.id}
      returning *
    `;
    if (rows.length === 0) {
      return Response.json({ error: "Surat tidak ditemukan." }, { status: 404 });
    }
    return Response.json({ data: rows[0] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/surat?id=...
export async function DELETE(req) {
  if (!isDbConfigured) {
    return Response.json({ error: "Database belum dikonfigurasi." }, { status: 400 });
  }
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return Response.json({ error: "id wajib diisi." }, { status: 400 });
    }
    const rows = await sql`select file_url from surat where id = ${id}`;
    const fileUrl = rows[0]?.file_url;
    if (fileUrl) {
      try {
        await del(fileUrl, { token: getBlobToken() });
      } catch (e) {
        // abaikan kalau file sudah tidak ada
      }
    }
    await sql`delete from surat where id = ${id}`;
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
