<div align="center">
  <h1>🚀 Campus-Connect UNIPMA</h1>
  <p><strong>Platform Manajemen Organisasi dan Kegiatan Mahasiswa Universitas PGRI Madiun (UNIPMA)</strong></p>
  <p><em>Built with Laravel, React, Inertia.js, and Tailwind CSS</em></p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Laravel-13.0-FF2D20?style=for-the-badge&logo=laravel" alt="Laravel" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Inertia.js-3.0-9553E9?style=for-the-badge&logo=inertia" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PHP-8.3+-777BB4?style=for-the-badge&logo=php" alt="PHP" />
</div>

<br />

## 📖 Deskripsi Proyek

**Campus-Connect UNIPMA** adalah platform aplikasi web terpadu yang dirancang secara khusus untuk memenuhi kebutuhan ekosistem mahasiswa di **Universitas PGRI Madiun (UNIPMA)**. Aplikasi ini difokuskan untuk mendigitalisasi dan mempermudah sistem manajemen **Organisasi Mahasiswa (Ormawa)**, **Unit Kegiatan Mahasiswa (UKM)**, dan **Badan Eksekutif Mahasiswa (BEM)** di lingkungan kampus UNIPMA.

Dengan memanfaatkan teknologi web modern (*Single Page Application*), Campus-Connect memastikan mahasiswa, pengurus organisasi, dan pihak administratif kampus dapat berkolaborasi secara real-time, mendaftar organisasi, mengelola kegiatan, serta mempublikasikan pengumuman dengan cepat, aman, dan efisien.

## 🌟 Fitur Utama & Hak Akses Berdasarkan Peran

Aplikasi ini dilengkapi dengan sistem berbasis peran (Role-Based Access Control) yang terbagi menjadi tiga tingkatan:

### 1. 👑 Administrator (Admin Kampus/Universitas)
Admin memiliki kontrol penuh terhadap sistem secara keseluruhan untuk memantau aktivitas kemahasiswaan:
- **Manajemen Pengguna (Users):** Mengelola akun mahasiswa, pengurus, maupun sesama admin (Tambah, Edit, Hapus, Suspend).
- **Manajemen Organisasi:** Menyetujui pendaftaran UKM/Ormawa baru, menonaktifkan organisasi, dan memantau struktur kepengurusan.
- **Pusat Informasi Kampus:** Membuat dan menyiarkan **Pengumuman** yang bersifat global/universitas kepada seluruh mahasiswa UNIPMA.
- **Monitoring Kegiatan:** Mengawasi dan menyetujui setiap program kerja atau **Kegiatan** yang diajukan oleh berbagai organisasi.

### 2. 👔 Pengurus Organisasi (Ketua/Pengurus UKM & Ormawa)
Mahasiswa yang memiliki mandat sebagai pengurus dalam suatu organisasi memiliki akses ke *Dashboard Pengurus* dengan fitur:
- **Manajemen Anggota:** Menerima (Approve) atau menolak (Reject) pendaftaran mahasiswa yang ingin bergabung ke UKM/Ormawa mereka, serta mengeluarkan anggota.
- **Pengumuman Internal:** Membuat pengumuman spesifik yang hanya dapat dibaca oleh anggota organisasi tersebut.
- **Manajemen Kegiatan (Event Management):** Merencanakan kegiatan, membuka pendaftaran peserta kegiatan, dan mempublikasikan jadwal program kerja UKM/Ormawa.

### 3. 🎓 Anggota (Mahasiswa UNIPMA)
Setiap mahasiswa aktif UNIPMA memiliki akses sebagai anggota dengan fitur berikut:
- **Eksplorasi Organisasi:** Melihat daftar lengkap Ormawa dan UKM yang ada di UNIPMA beserta profilnya, dan dapat melakukan pendaftaran secara online.
- **Akses Pengumuman Terpersonalisasi:** Mendapatkan update pengumuman baik dari pihak kampus (Admin) maupun dari organisasi yang mereka ikuti.
- **Partisipasi Kegiatan:** Melihat kalender kegiatan yang sedang berjalan dan mendaftarkan diri sebagai peserta pada kegiatan-kegiatan mahasiswa.
- **Dashboard Personal:** Memantau status keanggotaan di berbagai organisasi.

## ✨ Fitur Teknis Baru & Modern

- **Modern Tech Stack**: Menggunakan ekosistem terbaru (Laravel 13 & React 19).
- **Seamless SPA Routing**: Navigasi sisi klien yang sangat cepat tanpa proses *reload* halaman berkat **Inertia.js**.
- **UI/UX Premium**: Antarmuka dibangun menggunakan komponen **Radix UI** yang responsif dan dapat diakses (Accessible), dihias dengan **Tailwind CSS v4** untuk estetika yang clean dan modern.
- **Keamanan Tingkat Lanjut**: Terintegrasi dengan **Laravel Fortify & Sanctum** untuk sistem autentikasi dan manajemen sesi yang aman.
- **Pest PHP Testing**: Menggunakan kerangka pengujian terbaru dan elegan (Pest) untuk memastikan kestabilan kode.

## 🛠️ Teknologi yang Digunakan

### Backend
- [PHP](https://www.php.net/) ^8.3
- [Laravel Framework](https://laravel.com/) ^13.0
- [Laravel Fortify](https://laravel.com/docs/fortify) & [Sanctum](https://laravel.com/docs/sanctum)
- Database: SQLite (default) / MySQL / PostgreSQL

### Frontend
- [React](https://react.dev/) ^19.2.0
- [Inertia.js](https://inertiajs.com/) ^3.0
- [Vite](https://vitejs.dev/) ^8.0
- [Tailwind CSS](https://tailwindcss.com/) ^4.0
- [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/) (Icons)

## 📋 Prasyarat Sistem

Sebelum melakukan instalasi, pastikan sistem Anda telah memiliki perangkat lunak berikut:
- **PHP** >= 8.3
- **Composer** (Dependency Manager PHP)
- **Node.js** (LTS terbaru direkomendasikan) dan **npm**
- **Git**

## 🚀 Instalasi & Menjalankan Proyek (Development)

Berikut adalah langkah-langkah untuk menjalankan Campus-Connect UNIPMA di mesin lokal:

### 1. Kloning Repositori
```bash
git clone <url-repositori-anda>
cd campus-connect
```

### 2. Instalasi Dependensi Backend (PHP)
```bash
composer install
```

### 3. Persiapan Environment
Salin file konfigurasi lingkungan:
```bash
cp .env.example .env
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Konfigurasi & Migrasi Database
Aplikasi ini secara default dikonfigurasi menggunakan SQLite untuk mempermudah pengembangan awal:
```bash
php artisan migrate --seed
```
*(Tambahkan `--seed` jika Anda memiliki data dummy untuk Admin/User, jika ditanya untuk membuat file `database.sqlite`, pilih **Yes**).*

### 6. Instalasi Dependensi Frontend (Node.js)
```bash
npm install
```

---

## 💻 Menjalankan Server Development

Untuk mulai mengembangkan dan menjalankan aplikasi lokal dengan fitur *Hot-Reload* (HMR), jalankan perintah berikut:

```bash
npm run dev
```

Atau jalankan secara terpisah pada dua jendela terminal:

**Terminal 1 (Backend - Laravel):**
```bash
php artisan serve
```

**Terminal 2 (Frontend - Vite/React):**
```bash
npm run dev
```

Aplikasi kini dapat diakses melalui web browser pada: **[http://localhost:8000](http://localhost:8000)**

## 🧪 Pengujian (Testing)

Proyek ini telah dikonfigurasi dengan menggunakan **Pest PHP** untuk *Feature* dan *Unit Testing*. Untuk menjalankan pengujian:

```bash
composer test
```
atau
```bash
php artisan test
```

## 📜 Lisensi

Aplikasi ini dilisensikan secara *open-source* di bawah [MIT License](https://opensource.org/licenses/MIT).
