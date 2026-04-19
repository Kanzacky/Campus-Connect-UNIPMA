<div align="center">
  <h1>🚀 Campus-Connect</h1>
  <p><strong>A Modern Web Application built with Laravel, React, Inertia.js, and Tailwind CSS</strong></p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Laravel-13.0-FF2D20?style=for-the-badge&logo=laravel" alt="Laravel" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Inertia.js-3.0-9553E9?style=for-the-badge&logo=inertia" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PHP-8.3+-777BB4?style=for-the-badge&logo=php" alt="PHP" />
</div>

<br />

## 📖 Deskripsi Proyek

**Campus-Connect** adalah platform aplikasi web modern yang dibangun menggunakan fondasi *Laravel React Starter Kit*. Proyek ini dirancang untuk memberikan pengalaman pengguna yang cepat dan dinamis layaknya *Single Page Application* (SPA) dengan memanfaatkan keandalan backend Laravel dan reaktivitas frontend React melalui Inertia.js.

Proyek ini sangat cocok digunakan sebagai pondasi untuk membangun sistem manajemen Organisasi Mahasiswa (Ormawa), Unit Kegiatan Mahasiswa (UKM), platform kolaborasi kampus, atau dashboard administratif kegiatan mahasiswa.

## ✨ Fitur Utama

- **Modern Tech Stack**: Menggunakan versi terbaru dari ekosistem web modern (Laravel 13 & React 19).
- **Seamless Routing**: Navigasi sisi klien yang mulus menggunakan Inertia.js tanpa perlu membuat API terpisah.
- **UI Components**: Dibangun dengan komponen UI *headless* dari **Radix UI** yang di-styling menggunakan **Tailwind CSS v4**.
- **Autentikasi**: Terintegrasi dengan Laravel Fortify & Sanctum untuk manajemen keamanan dan sesi pengguna yang tangguh.
- **Developer Experience**: Dukungan *Hot Module Replacement* (HMR) menggunakan Vite, serta standarisasi format kode menggunakan ESLint dan Prettier.

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

## 📋 Prasyarat

Sebelum memulai instalasi, pastikan sistem Anda telah menginstal beberapa perangkat lunak berikut:

- **PHP** >= 8.3
- **Composer** (Dependency Manager untuk PHP)
- **Node.js** (Disarankan versi LTS terbaru) dan **npm**
- **Git**

## 🚀 Instalasi & Persiapan Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal di mesin Anda.

### 1. Kloning Repositori
```bash
git clone <url-repositori-anda>
cd campus-connect
```

### 2. Instalasi Dependensi Backend (PHP)
Jalankan perintah Composer untuk menginstal semua *library* PHP yang dibutuhkan:
```bash
composer install
```

### 3. Persiapan Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
*(Atau Anda bisa mengganti namanya secara manual).*

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Konfigurasi Database & Migrasi
Secara bawaan, aplikasi ini menggunakan SQLite. Anda tidak perlu setup tambahan, cukup jalankan migrasi:
```bash
php artisan migrate
```
*(Catatan: Anda mungkin akan ditanya untuk membuat file `database.sqlite` jika belum ada, pilih **Yes**).*

### 6. Instalasi Dependensi Frontend (Node.js)
```bash
npm install
```

---

## 💻 Menjalankan Server Development

Untuk menjalankan aplikasi secara lokal dengan dukungan *Hot-Reload* (HMR), Anda dapat menggunakan perintah berikut yang akan secara otomatis menjalankan server Laravel dan Vite secara bersamaan:

```bash
npm run dev
```

Atau jika Anda ingin menjalankannya secara terpisah:

**Terminal 1 (Backend):**
```bash
php artisan serve
```
**Terminal 2 (Frontend):**
```bash
npm run dev
```

Aplikasi sekarang dapat diakses melalui browser pada alamat: **[http://localhost:8000](http://localhost:8000)**

## 🧪 Pengujian (Testing)

Proyek ini telah dikonfigurasi untuk menjalankan pengujian menggunakan **Pest PHP**. Untuk menjalankan suite pengujian, gunakan perintah:

```bash
composer test
```
atau
```bash
php artisan test
```

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT).
