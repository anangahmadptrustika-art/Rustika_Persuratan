// Helper untuk memanggil API surat dari komponen client.

export async function getSurat(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  const res = await fetch(`/api/surat${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  return res.json(); // { configured, data, error? }
}

export async function createSurat(payload) {
  const res = await fetch("/api/surat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal menyimpan surat.");
  return json.data;
}

export async function updateSuratFile(id, file_url, file_path) {
  const res = await fetch("/api/surat", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, file_url, file_path }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal memperbarui dokumen.");
  return json.data;
}

export async function deleteSurat(id) {
  const res = await fetch(`/api/surat?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal menghapus surat.");
  return json;
}
