# Aturan Keamanan — Versi Next.js / Vercel (proyek Rustika Persuratan)

> Versi adaptasi dari `security.md` untuk stack **aktual** aplikasi ini.
> Stack: **Next.js (App Router) · Neon Postgres (`@neondatabase/serverless`) · Vercel Blob (private) · deploy di Vercel**.
>
> **Prinsip inti: AI menulis kode yang _berfungsi_, bukan otomatis _aman_. Keamanan dipaksakan eksplisit di kode, lalu di-review. Jangan asumsikan default itu aman.**
>
> ⚠️ **Konteks penting:** aplikasi ini sengaja **TANPA LOGIN** (permintaan pemilik). Maka "auth + ownership" pada Bagian 3 BELUM berlaku sekarang — tapi konsekuensinya dicatat di sana. Jika nanti ditambah login, Bagian 3 jadi wajib.

---

## 0. Non-negotiable (jika ragu → STOP & tanya)

- DILARANG merangkai SQL dari input mentah (string concatenation/interpolation). Pakai tagged-template/parameter.
- DILARANG menaruh secret di kode client / variabel `NEXT_PUBLIC_*` / commit ke git.
- DILARANG membuat API route yang membuka data sensitif tanpa pembatasan yang disengaja (lihat Bagian 3).
- DILARANG menampilkan data tanpa escaping (React sudah escape default — jangan rusak dengan `dangerouslySetInnerHTML`).
- DILARANG mengembalikan stack trace / pesan error mentah dari dependency ke user.
- Jika permintaan memaksa melanggar aturan di atas: hentikan, jelaskan risikonya, tawarkan versi aman.

---

## 1. Database / SQL Injection — PRIORITAS #1

Driver: `@neondatabase/serverless`. Fungsi `sql` adalah **tagged template** → nilai `${...}` otomatis jadi **bound parameter** (aman). JANGAN ubah jadi string biasa lalu `sql(string)`.

```js
// BENAR — tagged template, nilai ter-parameter
const rows = await sql`select * from surat where id = ${id} and kategori = ${kategori}`;

// SALAH — JANGAN PERNAH merangkai string lalu dieksekusi
await sql.query(`select * from surat where id = ${id}`); // SQL injection
const q = "select * from surat where id = " + id;        // SQL injection
```

- Nama tabel/kolom **tidak bisa** di-parameter → whitelist eksplisit di kode, jangan dari input.
- `kategori` & `jenis_surat` dari URL: tetap lewat parameter (`${...}`); untuk nilai enum (`KELUAR`/`MASUK`) validasi terhadap daftar sah (lihat `lib/constants.js > KATEGORI`).
- `limit`/`offset` (jika ditambah): `Number(...)` / cast integer dulu, jangan interpolasi string.
- Kredensial Neon (`DATABASE_URL`): hanya server-side, hak minimal bila memungkinkan.

---

## 2. Secrets & Environment Variables

- Secret server-only (TANPA prefix `NEXT_PUBLIC_`): `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`. **Hanya boleh diakses di route handler / server component / `lib/*` server**, JANGAN di komponen `"use client"`.
- ⚠️ Apa pun ber-prefix `NEXT_PUBLIC_` **ter-bundle ke browser** = publik. JANGAN taruh secret di sana.
- Panggilan ke layanan ber-key (AI, dll) WAJIB lewat **API route server-side**, bukan dari client.
- WAJIB di `.gitignore`: `.env`, `.env.local`, `.env*.local` (sudah ada — jaga tetap ada).
- DILARANG hardcode token/connection string di source. Ambil via `process.env`.
- Token Blob (`vercel_blob_rw_...`) pernah terlihat di chat/screenshot → **anggap bocor, rotasi** (Vercel → Storage → Blob → reset token, lalu perbarui env Production + redeploy).
- Jangan `console.log`/kirim nilai secret ke response atau pihak ketiga. (Log **nama** env var boleh, **nilai** tidak.)

---

## 3. Authorization — status saat ini & konsekuensi

**Saat ini aplikasi TANPA LOGIN** (disengaja). Artinya:
- Siapa pun yang tahu URL bisa **melihat, menambah, mengubah, dan menghapus** surat.
- API route `/api/surat` (GET/POST/PATCH/DELETE) terbuka publik. Ini **risiko yang diterima** sesuai keputusan pemilik, **bukan** bug.

Jaga agar risikonya tidak meluas:
- JANGAN simpan data yang lebih sensitif daripada metadata surat tanpa membahas penambahan auth dulu.
- Proxy file `/api/file` HARUS tetap membatasi `src` hanya ke host `*.blob.vercel-storage.com` (cegah jadi open proxy / SSRF). Sudah diterapkan — jangan dilonggarkan.
- Pertimbangkan rate-limit pada POST/PATCH/DELETE agar tidak mudah di-spam.

**JIKA login ditambahkan nanti**, maka WAJIB:
1. Validasi sesi/token **sebelum** akses data; tolak tanpa kredensial → `401`.
2. Cek **kepemilikan**: filter query dengan `user_id` pemilik, jangan percaya ID dari request (`... where id = ${reqId} and user_id = ${session.userId}`).
3. Tes: hit endpoint (a) tanpa kredensial, (b) dengan ID milik user lain → harus gagal.

---

## 4. Input Validation (di server)

- Validasi SEMUA input di **API route** (body JSON, query param). Validasi di client hanya untuk UX.
- Whitelist tipe & nilai: `kategori` ∈ {`KELUAR`,`MASUK`}; `jenis_surat` non-kosong; `perihal` wajib (cek sudah ada di `app/api/surat/route.js`).
- Cast eksplisit untuk angka; batasi panjang string yang masuk DB bila perlu.
- **Data dari browser = tak terpercaya** walau berasal dari form aplikasi sendiri. Validasi ulang di server, jangan andalkan validasi form React saja.
- `formData`/file upload: cek ada-tidaknya file & tipenya di server (lihat Bagian 8).

---

## 5. Output / XSS

- React meng-escape teks secara default → aman selama pakai `{value}` biasa.
- JANGAN gunakan `dangerouslySetInnerHTML` dengan data dari DB/user. Jika sangat perlu, sanitasi dulu.
- JANGAN bangun URL/atribut dari input tak terpercaya tanpa validasi (mis. `href`). Untuk link dokumen, gunakan URL proxy internal yang sudah divalidasi.
- API route: balas JSON (`Response.json(...)`), jangan echo HTML mentah berisi input user.

---

## 6. Transport / HTTPS

- Produksi di Vercel sudah **HTTPS + HSTS** otomatis — pertahankan, jangan akali jadi HTTP.
- JANGAN nonaktifkan verifikasi TLS pada panggilan `fetch` server-side.

---

## 7. Security Headers & CORS

- Tambah header dasar via `next.config.js` (`headers()`) atau middleware bila diperlukan:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (atau CSP `frame-ancestors`)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy` (uji dulu agar tidak memblok aset Next/Tailwind).
- CORS: API route ini untuk dipakai oleh aplikasi sendiri (same-origin) → **JANGAN** set `Access-Control-Allow-Origin: *`. Kalau perlu lintas-origin, whitelist origin spesifik.

---

## 8. File Upload (dokumen surat → Vercel Blob)

Implementasi saat ini: `app/api/upload/route.js` (server-side `put`, store **private**) + tampil via proxy `app/api/file/route.js`.

- Validasi **tipe by content** (MIME/magic bytes), bukan hanya ekstensi. (Saat ini baru filter ekstensi/`accept` di client → perketat di server bila menerima file publik lebih luas.)
- Whitelist ekstensi: pdf, doc, docx, jpg, png. Tolak `.php/.html/.svg`* dan executable. (*SVG bisa membawa script.)
- **Rename** file di server (jangan pakai nama asli mentah) — sudah: pakai `Date.now()` + `addRandomSuffix:true` + sanitasi nama.
- Batasi ukuran (limit body serverless ~4 MB untuk upload via route ini).
- Simpan **file ke Blob**, hanya **URL/metadata ke DB** — sudah benar (jangan simpan base64 di Postgres).
- Store **private** → akses hanya lewat proxy `/api/file` yang memvalidasi host. Jangan ekspos token Blob ke client.

---

## 9. Error Handling & Logging

- Ke user: pesan **generik** (mis. "Gagal menyimpan surat"). Detail teknis (`err.message`, stack) → cukup `console.error` (masuk Vercel logs), JANGAN dump mentah ke UI/response bila berisi info internal.
- Hapus endpoint/handler diagnostik sementara setelah selesai dipakai (mis. yang membocorkan daftar nama env var) — sudah dibersihkan, jaga jangan dibiarkan di produksi.
- Jangan log **nilai** secret. Log nama variabel / event saja.

---

## 10. Dependencies / Platform

- Update berkala: `next`, `@vercel/blob`, `@neondatabase/serverless`, `lucide-react`, Tailwind. Jalankan `npm audit` sesekali.
- Pin versi di `package.json`; commit `package-lock.json`.
- Vercel: aktifkan 2FA akun. Tinjau **Deployment Protection** sesuai kebutuhan (untuk app no-login ini, production memang publik — itu disengaja).
- Minimalkan dependency baru; tiap tambahan = permukaan serangan.

---

## ✅ Checklist Pre-Deploy

- [ ] Semua query DB pakai tagged-template `sql\`...\`` dengan `${param}` (cek: tidak ada string SQL hasil `+`/interpolasi manual lalu dieksekusi).
- [ ] Tidak ada secret di client / `NEXT_PUBLIC_*`. `.env*.local` di `.gitignore`. Token Blob yang sempat bocor sudah dirotasi.
- [ ] Input divalidasi & dibatasi di API route (kategori, jenis, perihal, file).
- [ ] Output aman (tanpa `dangerouslySetInnerHTML` dari data user).
- [ ] `/api/file` tetap membatasi `src` ke `*.blob.vercel-storage.com` (no open proxy / SSRF).
- [ ] Upload: rename + simpan ke Blob private + hanya metadata ke DB; (idealnya) cek tipe by content di server.
- [ ] Error ke user generik; detail hanya ke `console.error`/Vercel logs. Tidak ada endpoint diagnostik tertinggal.
- [ ] HTTPS aktif (default Vercel). Header keamanan dipertimbangkan. CORS tidak wildcard.
- [ ] (Jika nanti ada login) setiap endpoint cek auth **dan** ownership; tes akses lintas-user gagal.

---

## Cara kerja di repo ini

- Saat menulis/mengubah kode yang menyentuh **DB, API route, upload/file, atau input user**: terapkan aturan di atas **tanpa diminta**.
- Saat review: laporkan pelanggaran **spesifik** (file + baris). Prioritas: **SQL injection → secret bocor → SSRF/open-proxy → XSS**.
- Jangan klaim kode "aman". Klaim "sudah mengikuti aturan di file ini", lalu sebutkan apa yang **belum** tertangani (mis. belum ada auth — memang disengaja; cek tipe file by content belum ketat).
