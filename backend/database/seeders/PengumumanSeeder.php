<?php

namespace Database\Seeders;

use App\Models\Organisasi;
use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Database\Seeder;

class PengumumanSeeder extends Seeder
{
    /**
     * Seed pengumuman untuk beberapa organisasi dan pengumuman global.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@unipma.ac.id')->first();
        $pengurus1 = User::where('email', 'rafli@unipma.ac.id')->first();
        $pengurus2 = User::where('email', 'raka@unipma.ac.id')->first();

        $bem = Organisasi::where('name', 'BEM (Badan Eksekutif Mahasiswa)')->first();
        $ukmSeni = Organisasi::where('name', 'UKM Seni')->first();

        if (! $admin || ! $pengurus1 || ! $pengurus2 || ! $bem || ! $ukmSeni) {
            return;
        }

        $pengumumans = [
            // Pengumuman global (dari admin)
            [
                'organisasi_id' => null,
                'judul' => 'Selamat Datang di Campus Connect!',
                'konten' => 'Platform Campus Connect kini telah resmi diluncurkan. Seluruh mahasiswa dapat mendaftar dan bergabung dengan organisasi/UKM pilihan masing-masing. Silakan eksplorasi fitur-fitur yang tersedia dan jangan ragu untuk menghubungi admin jika ada kendala.',
                'is_pinned' => true,
                'created_by' => $admin->id,
            ],
            [
                'organisasi_id' => null,
                'judul' => 'Pendaftaran UKM & Organisasi Semester Genap 2026 Dibuka',
                'konten' => 'Pendaftaran anggota baru UKM dan Organisasi untuk semester genap tahun ajaran 2025/2026 telah resmi dibuka. Mahasiswa dapat mendaftar melalui platform Campus Connect mulai tanggal 1 Maret hingga 31 Maret 2026. Segera daftarkan diri Anda!',
                'is_pinned' => true,
                'created_by' => $admin->id,
            ],
            // Pengumuman BEM
            [
                'organisasi_id' => $bem->id,
                'judul' => 'Rapat Koordinasi Mingguan BEM',
                'konten' => 'Diberitahukan kepada seluruh pengurus dan anggota BEM bahwa rapat koordinasi mingguan akan dilaksanakan setiap hari Senin pukul 16.00 WIB di Sekretariat BEM. Kehadiran wajib bagi seluruh pengurus inti.',
                'is_pinned' => false,
                'created_by' => $pengurus1->id,
            ],
            [
                'organisasi_id' => $bem->id,
                'judul' => 'Rekrutmen Panitia Musyawarah Besar',
                'konten' => 'BEM membuka rekrutmen panitia untuk Musyawarah Besar 2026. Bagi anggota yang berminat menjadi panitia, silakan isi formulir yang tersedia di sekretariat BEM paling lambat tanggal 30 April 2026.',
                'is_pinned' => false,
                'created_by' => $pengurus1->id,
            ],
            // Pengumuman UKM Seni
            [
                'organisasi_id' => $ukmSeni->id,
                'judul' => 'Latihan Rutin UKM Seni',
                'konten' => 'Jadwal latihan rutin UKM Seni setiap hari Rabu dan Jumat pukul 15.30-17.30 WIB di Studio Seni Gedung C. Seluruh anggota diharapkan hadir tepat waktu dan membawa perlengkapan masing-masing.',
                'is_pinned' => false,
                'created_by' => $pengurus2->id,
            ],
            [
                'organisasi_id' => $ukmSeni->id,
                'judul' => 'Pengumpulan Karya untuk Pameran',
                'konten' => 'Bagi anggota yang ingin berpartisipasi dalam Pameran Seni Rupa Mahasiswa, harap mengumpulkan karya paling lambat tanggal 20 Mei 2026 ke koordinator pameran. Karya yang diterima meliputi lukisan, sketsa, dan karya digital.',
                'is_pinned' => true,
                'created_by' => $pengurus2->id,
            ],
        ];

        foreach ($pengumumans as $pengumuman) {
            Pengumuman::create($pengumuman);
        }
    }
}
