# Jibal Malikul Jabbar — Portfolio

Portfolio pribadi bertema **pixel-art RPG / terminal** untuk siswa SMK jurusan PPLG dan backend developer.
Dibangun dengan **HTML5, CSS3, dan Vanilla JavaScript** — tanpa framework, tanpa build step, tanpa library pihak ketiga.

Tema visualnya mengambil dari game RPG 8-bit: panel, border, dan tombol berbentuk pixel, dengan nuansa terminal hijau-kaca yang tetap terbaca dan profesional.

---

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur File](#struktur-file)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Menyesuaikan Konten](#menyesuaikan-konten)
- [Deploy](#deploy)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
  - [Netlify](#netlify)
  - [Hosting statis lain](#hosting-statis-lain)
- [Struktur `script.js`](#struktur-scriptjs)
- [Aksesibilitas](#aksesibilitas)
- [Performa](#performa)
- [Known Issues](#known-issues)
- [Lisensi](#lisensi)

---

## Fitur

| Fitur | Keterangan |
|---|---|
| **Intro START** | Layar pembuka ala title screen game. Muncul sekali per sesi browser, bisa diputar ulang lewat tombol `REPLAY INTRO` di footer. |
| **Smooth scroll** | Navigasi antar section dengan offset aman dari navbar, dan fokus otomatis ke section tujuan. |
| **Active nav state** | Link navbar menandai section yang sedang dibaca, diperbarui saat scroll. |
| **Menu mobile** | Hamburger menu dengan `aria-expanded`, tertutup otomatis setelah link diklik. |
| **Typewriter** | Teks peran di hero diketik letter by letter. Teks asli ada di HTML, jadi tetap terbaca bila JavaScript mati. |
| **Reveal on scroll** | Elemen_section muncul halus saat masuk viewport, jalan sekali saja. |
| **Progress bar** | Bar skill terisi otomatis dari nilai `--v` di HTML saat bar masuk layar. |
| **Modal detail** | Native `<dialog>` untuk detail project. Focus trap dan tombol `Esc` ditangani browser. |
| **Lightbox foto** | Pratinjau foto Memory Log dalam dialog, `alt` diambil dari atribut HTML. |
| **SFX 8-bit** | Efek suara sintetis via Web Audio API, **default OFF**, tanpa file audio, tanpa autoplay. |
| **Pixel burst** | Efek pixel melesat sekali jalan saat tombol START ditekan. Mati di HP dan mode reduced motion. |
| **Keyboard support** | `↑` / `↓` / `PageUp` / `PageDown` untuk pindah section, `Esc` menutup modal. |
| **Progress bar skill** | Menampilkan skill sebagai bar bergaya RPG, lengkap dengan tier `NOVICE` / `ACTIVE` / `PROFFICIENT`. |

---

## Teknologi

Hanya tiga hal, semuanya bawaan browser:

- **HTML5** — semantic markup, native `<dialog>`, inline SVG sprite (tanpa file ikon eksternal).
- **CSS3** — custom properties, grid & flexbox, `prefers-reduced-motion`, `IntersectionObserver`-friendly.
- **Vanilla JavaScript** — 9 modul dalam satu IIFE, nol dependensi.

**Sumber daya eksternal:** hanya Google Fonts (`Press Start 2P` + `JetBrains Mono`).
Tidak ada CDN JavaScript, tidak ada library, tidak ada framework.

---

## Struktur File

```
portofolio/
├── index.html              # Struktur & seluruh konten
├── style.css               # Tema pixel RPG, layout, komponen, responsive
├── script.js               # Semua interaksi
├── assets/
│   ├── favicon.svg         # Favicon pixel terminal
│   └── img/
│       ├── player-photo.webp   # Foto profil di hero
│       ├── quest-01.jpg        # Foto Memory Log #1
│       └── quest-02.jpg        # Foto Memory Log #2
├── README.md
└── .vscode/
    └── settings.json       # Encoding UTF-8 untuk editor
```

Section di `index.html`:

| Section | `id` | Isi |
|---|---|---|
| Hero | `home` | Nama, status online, typewriter peran, bar HP/XP, tombol aksi |
| Profile | `about` | Biodata, bar atribut, pengalaman organisasi |
| Skills | `skills` | Bar skill + tier, kategori peminatan |
| Projects | `projects` | Kartu project + tombol `VIEW` ke modal detail |
| Quest Log | `quest` | Riwayat kegiatan, BASIS, ACHIEVEMENT, EVENT |
| Memory Log | `log` | Galeri foto kegiatan |
| Contact | `contact` | Terminal email, GitHub, Instagram, LinkedIn |

---

## Menjalankan Secara Lokal

Situsnya sepenuhnya statis. Buka `index.html` langsung di browser dan semuanya jalan:

```bash
# Opsi 1: klik dua kali index.html
# Opsi 2: jalankan server lokal agar konsisten dengan produksi
```

Kalau pakai server lokal:

```bash
# Python
python -m http.server 8000

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8000`.

> **Catatan:** `sessionStorage` diblokir browser pada skema `file://`, jadi fitur "skip intro setelah kunjungan pertama" tidak tersimpan kalau situs dibuka langsung dari file. Semua fitur lain tetap normal. Jalankan lewat server lokal untuk pengalaman yang identik dengan versi online.

---

## Menyesuaikan Konten

Semua perubahan cukup dilakukan di `index.html`. Cari komentar `<!-- ... -->` yang menandai bagian yang perlu diubah.

### 1. Ganti nama, deskripsi, dan SEO

```html
<title>Nama Kamu — PPLG Student | Backend Developer</title>
<meta name="description" content="Deskripsi singkat tentang kamu.">
<meta property="og:title" content="Nama Kamu">
```

### 2. Ganti tautan sosial (section Contact)

Cari `href="#"` lalu ganti dengan URL asli:

```html
<a class="px-btn px-btn--block" href="https://github.com/username"
   target="_blank" rel="noopener noreferrer" data-sfx="confirm">
```

Yang perlu diganti:

| Item | Line | Nilai sekarang |
|---|---|---|
| Email | `index.html` | `m.jibal82@gmail.com` (sudah aktif) |
| GitHub | `index.html` | `href="#"` — **placeholder** |
| Instagram | `index.html` | `href="#"` — **placeholder** |
| LinkedIn | `index.html` | `href="#"` — **placeholder** |

Hapus juga baris pengingat di bawahnya:

```html
<!-- TODO: ganti dengan akun asli -->
<p class="terminal__note">// Ganti link GitHub, Instagram, dan LinkedIn di file index.html.</p>
```

### 3. Ganti foto profil

Taruh file baru di `assets/img/`, lalu ubah `src`:

```html
<img src="assets/img/nama-foto-kamu.webp" alt="Foto profil Nama Kamu" ...>
```

Rekomendasi: format `.webp` atau `.jpg`, maksimal ±150 KB, lebar ±720px, potret (3:4).

### 4. Ganti foto Memory Log

Setiap thumbnail memakai `data-shot` (path untuk lightbox) dan `data-shot-alt` (teks alternatif):

```html
<button data-shot="assets/img/foto-kamu.jpg" data-shot-alt="Deskripsi foto">
```

### 5. Ganti project / modal

Tambah project dengan menyalin satu blok `<dialog>`, lalu sesuaikan `id`, `aria-labelledby`, dan isi. Tombol pemicunya:

```html
<button data-modal-open="dlg-id-baru" data-sfx="confirm">VIEW</button>
```

Ganti juga isi `modal__note` yang masih berupa placeholder.

### 6. Ganti lebar progress bar

Nilai ada di atribut `style`, tidak ada angka yang ditampilkan di teks:

```html
<div class="bar"><span class="bar__fill" style="--v:82%"></span></div>
```

Teks tier (`NOVICE`, `ACTIVE`, `PROFICIENT`) ada di elemen `<span>` sebelahnya — ganti manual supaya konsisten denganPersentase.

### 7. Ganti warna tema

Semua warna ada sebagai custom property di bagian atas `style.css`:

```css
:root {
  --bg: #06080f;
  --green: #35e07f;
  --blue: #4d9fff;
  --purple: #b06cff;
  /* ... */
}
```

---

## Deploy

Karena ini situs statis, tidak ada build step. Yang perlu dipublish hanya `index.html`, `style.css`, `script.js`, dan folder `assets/`.

> **Jangan ikut meng-upload folder `image/`** — itu aset lama yang sudah tidak dipakai. Hapus dulu sebelum deploy supaya repo tetap ringan.

---

### GitHub Pages

**Cara 1 — lewat UI (paling cepat)**

1. Push repo ke GitHub.
2. Buka **Settings → Pages**.
3. **Source**: pilih branch `main`, folder `/ (root)`.
4. Klik **Save**. Tunggu ±1 menit.
5. Situs tersedia di `https://username.github.com/nama-repo/`.

**Cara 2 — lewat GitHub Actions (recommended, auto-deploy tiap push)**

Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

Lalu di **Settings → Pages** pilih **Source: GitHub Actions**. Setelah itu setiap `git push` ke `main` otomatis memuat ulang situs.

> **Link relatif sudah aman.** Semua path aset memakai bentuk relatif (`assets/img/...`), bukan `/assets/...`, jadi situs tetap jalan di subfolder repo maupun di domain sendiri.

---

### Cloudflare Pages

1. Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pilih repo, lalu isi:
   - **Framework preset**: None
   - **Build command**: *(kosongkan)*
   - **Build output directory**: `/`
3. **Save and Deploy**.

Untuk domain sendiri: tab **Custom domains** → **Set up a custom domain**.

> Project tanpa build command tidak wajib masuk branch tertentu. Kalau ingin preview per branch, samakan **Production branch** di **Settings**.

---

### Netlify

1. **Add new site → Import an existing project** dari Git.
2. Isi:
   - **Build command**: *(kosongkan)*
   - **Publish directory**: `.`
3. **Deploy site**.

Alternatif tanpa git: tarik folder ke **https://app.netlify.com/drop**.

---

### Hosting statis lain

| Platform | Build command | Publish directory |
|---|---|---|
| Vercel | *(kosong)* | `.` |
| GitLab Pages | *(kosong)* | root repo |
| Surge | *(kosong)* | `.` |
| Firebase Hosting | *(kosong)* | `public` (pindahkan file ke `public/`) |

---

## Struktur `script.js`

Semua kode dibungkus satu IIFE supaya tidak ada variabel global yang bocor. Urutan modul di file:

| # | Modul | Tugas |
|---|---|---|
| 1 | `util` | Helper selector, cek `prefers-reduced-motion`, deteksi dukungan `<dialog>` |
| 2 | `intro` | Layar START, `sessionStorage`, tombol REPLAY |
| 3 | `nav` | Smooth scroll, menu mobile, active state via `IntersectionObserver` |
| 4 | `typewriter` | Ketik teks peran di hero, berhenti saat tab tidak aktif |
| 5 | `reveal` | Reveal on scroll + isi progress bar dari `--v` |
| 6 | `modal` | Buka/tutup `<dialog>`, lightbox, kembalikan fokus |
| 7 | `sound` | SFX 8-bit via Web Audio, toggle di navbar |
| 8 | `keys` | Pintasan keyboard (`↑` `↓` `PageUp` `PageDown` `Esc`) |
| 9 | `fx` | Burst pixel sekali jalan |

### Menonaktifkan SFX

Tombol SFX di navbar menyimpan pilihan user di `localStorage` (key `jibal-sfx`). Defaultnya **OFF**. Kalau mau SFX mati permanen, hapus blok ini dari `script.js`:

```js
$$('[data-sfx]').forEach(function (el) {
  el.addEventListener('click', function () {
    play(el.getAttribute('data-sfx'));
  });
});
```

### Menyesuaikan kecepatan typewriter

```js
timer = window.setTimeout(tick, 42 + Math.random() * 38);  // 42-80ms per huruf
```

### Menyesuaikan jarak scroll dari navbar

Kalau tinggi navbar berubah, sesuaikan satu variabel di `script.js`:

```js
var NAV_OFFSET = 90;  // dalam pixel
```

---

## Aksesibilitas

- **Progressive enhancement** — konten tetap utuh dan terbaca tanpa JavaScript. Class `.reveal` baru disembunyikan setelah `reveal-ready` ditulis, jadi kalau `script.js` gagal, tidak ada konten yang terkunci di `opacity: 0`.
- **Semantic HTML** — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, heading berurutan tanpa lompatan level.
- **Focus management** — fokus dikembalikan ke tombol pemicu setiap modal ditutup, termasuk saat ditutup dengan `Esc` atau klik area gelap.
- **Focus trap** — ditangani native oleh `<dialog>`.
- **Label** — tombol close punya `aria-label`, lightbox punya `aria-label`, section punya `aria-labelledby` / `aria-label`.
- **Link eksternal** — selalu memakai `rel="noopener noreferrer"`.
- **`prefers-reduced-motion`** — animasi dimatikan, teks langsung tampil utuh, progress bar langsung terisi.
- **Ikon SVG** — `aria-hidden="true"` supaya tidak dibaca screen reader sebagai teks.
- **SFX opt-in** — tidak ada autoplay, sesuai kebijakan browser.

---

## Performa

Ukuran total payload lokal (tanpa font eksternal):

| File | Ukuran |
|---|---|
| `index.html` | ±38 KB |
| `style.css` | ±32 KB |
| `script.js` | ±20 KB |
| `assets/img/player-photo.webp` | ±150 KB |
| `assets/img/quest-01.jpg` | ±95 KB |
| `assets/img/quest-02.jpg` | ±104 KB |
| `assets/favicon.svg` | ±1 KB |
| **Total** | **±440 KB** |

Yang membuat halaman ini ringan:

- Nol request JavaScript eksternal.
- Nol library, nol polyfill.
- Ikon berupa inline SVG sprite — 1 request untuk semuanya.
- Foto sudah dikompresi, dan `loading="lazy"` pada thumbnail.
- `IntersectionObserver` untuk reveal dan progress bar, bukan loop `scroll` yang berjalan terus.
- Typewriter memakai `setTimeout` per huruf dan berhenti otomatis saat tab tidak aktif.
- Burst pixel di-create lalu dihapus dari DOM, dan dimatikan di HP.

---

## Known Issues

Placeholder yang **wajib diganti sebelum situs dipublish**:

1. **Tautan GitHub, Instagram, LinkedIn** masih `href="#"`.
2. **Isi modal project** masih deskripsi umum — ganti dengan detail project asli.
3. **Meta `og:image` dan `og:url`** belum diisi. Tambahkan setelah domain/domain repo diketahui:

   ```html
   <meta property="og:url" content="https://domain-kamu.com/">
   <meta property="og:image" content="https://domain-kamu.com/assets/img/player-photo.webp">
   ```

4. **Folder `image/`** berisi aset lama (±4,2 MB) yang tidak dipakai. Hapus sebelum deploy.

---

## Lisensi

Bebas dipakai dan dimodifikasi untuk keperluan pribadi.

Foto di `assets/img/` adalah milik pemilik portofolio. Font `Press Start 2P` dan `JetBrains Mono` lisensinya gratis untuk penggunaancommercial (SIL Open Font License).
#   j i b a l j a b b a r . g i t h u b . i o  
 