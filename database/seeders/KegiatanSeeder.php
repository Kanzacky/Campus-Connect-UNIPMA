<?php

namespace Database\Seeders;

use App\Models\Kegiatan;
use App\Models\Organisasi;
use App\Models\User;
use Illuminate\Database\Seeder;

class KegiatanSeeder extends Seeder
{
    /**
     * Seed kegiatan (events) untuk beberapa organisasi.
     */
    public function run(): void
    {
        $pengurus1 = User::where('email', 'rafli@unipma.ac.id')->first();
        $pengurus2 = User::where('email', 'raka@unipma.ac.id')->first();

        $bem = Organisasi::where('name', 'BEM (Badan Eksekutif Mahasiswa)')->first();
        $ukmSeni = Organisasi::where('name', 'UKM Seni')->first();
        $futsal = Organisasi::where('name', 'UKM Futsal')->first();

        if (! $bem || ! $ukmSeni || ! $futsal || ! $pengurus1 || ! $pengurus2) {
            return;
        }

        $kegiatans = [
            [
                'organisasi_id' => $bem->id,
                'judul' => 'Musyawarah Besar BEM 2026',
                'deskripsi' => 'Musyawarah besar tahunan BEM untuk membahas program kerja dan pemilihan ketua baru periode 2026/2027. Seluruh anggota wajib hadir.',
                'tanggal_mulai' => '2026-05-15 08:00:00',
                'tanggal_selesai' => '2026-05-15 17:00:00',
                'lokasi' => 'Aula Utama Universitas',
                'status' => 'published',
                'created_by' => $pengurus1->id,
            ],
            [
                'organisasi_id' => $bem->id,
                'judul' => 'Workshop Leadership & Public Speaking',
                'deskripsi' => 'Workshop pengembangan kemampuan kepemimpinan dan public speaking untuk seluruh mahasiswa. Pembicara: Dr. Ahmad Suryadi, M.Pd.',
                'tanggal_mulai' => '2026-05-20 09:00:00',
                'tanggal_selesai' => '2026-05-20 15:00:00',
                'lokasi' => 'Gedung Serbaguna Lt. 3',
                'status' => 'published',
                'created_by' => $pengurus1->id,
            ],
            [
                'organisasi_id' => $bem->id,
                'judul' => 'Bakti Sosial Ramadhan',
                'deskripsi' => 'Kegiatan bakti sosial dalam rangka menyambut bulan Ramadhan. Pembagian sembako kepada masyarakat sekitar kampus.',
                'tanggal_mulai' => '2026-03-10 07:00:00',
                'tanggal_selesai' => '2026-03-10 12:00:00',
                'lokasi' => 'Desa Binaan Universitas',
                'status' => 'selesai',
                'created_by' => $pengurus1->id,
            ],
            [
                'organisasi_id' => $ukmSeni->id,
                'judul' => 'Pameran Seni Rupa Mahasiswa',
                'deskripsi' => 'Pameran karya seni rupa mahasiswa meliputi lukisan, patung, dan instalasi seni. Terbuka untuk umum.',
                'tanggal_mulai' => '2026-06-01 10:00:00',
                'tanggal_selesai' => '2026-06-03 18:00:00',
                'lokasi' => 'Galeri Seni Kampus',
                'status' => 'draft',
                'created_by' => $pengurus2->id,
            ],
            [
                'organisasi_id' => $ukmSeni->id,
                'judul' => 'Pentas Seni Akhir Semester',
                'deskripsi' => 'Pertunjukan seni akhir semester menampilkan tari, musik, dan teater dari seluruh anggota UKM Seni.',
                'tanggal_mulai' => '2026-06-20 18:00:00',
                'tanggal_selesai' => '2026-06-20 22:00:00',
                'lokasi' => 'Auditorium Kampus',
                'status' => 'published',
                'created_by' => $pengurus2->id,
            ],
            [
                'organisasi_id' => $futsal->id,
                'judul' => 'Turnamen Futsal Antar Jurusan',
                'deskripsi' => 'Turnamen futsal tahunan antar jurusan. Pendaftaran tim dibuka mulai 1 Mei 2026. Hadiah menarik untuk 3 besar.',
                'tanggal_mulai' => '2026-05-25 08:00:00',
                'tanggal_selesai' => '2026-05-27 17:00:00',
                'lokasi' => 'Lapangan Futsal Indoor Kampus',
                'status' => 'published',
                'created_by' => $pengurus1->id,
            ],
        ];

        foreach ($kegiatans as $kegiatan) {
            Kegiatan::create($kegiatan);
        }
    }
}
