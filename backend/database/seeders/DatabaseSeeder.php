<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat user Admin
        User::factory()->create([
            'name' => 'Admin Campus',
            'email' => 'admin@unipma.ac.id',
            'role' => 'admin',
            'nim' => null,
            'jurusan' => null,
            'angkatan' => null,
        ]);

        // Buat user Pengurus
        $pengurus1 = User::factory()->create([
            'name' => 'Muhammad Rafli Akbar',
            'email' => 'rafli@unipma.ac.id',
            'role' => 'pengurus',
            'nim' => '2305101001',
            'jurusan' => 'Teknik Informatika',
            'angkatan' => '2023',
        ]);

        $pengurus2 = User::factory()->create([
            'name' => 'Raka Pradana',
            'email' => 'raka@unipma.ac.id',
            'role' => 'pengurus',
            'nim' => '2305101002',
            'jurusan' => 'Sistem Informasi',
            'angkatan' => '2023',
        ]);

        $pengurus3 = User::factory()->create([
            'name' => 'Fajar Nugroho',
            'email' => 'fajar@unipma.ac.id',
            'role' => 'pengurus',
            'nim' => '2305101003',
            'jurusan' => 'Pendidikan Jasmani',
            'angkatan' => '2023',
        ]);

        // Buat user Anggota
        $anggota1 = User::factory()->create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@unipma.ac.id',
            'role' => 'anggota',
            'nim' => '2305101010',
            'jurusan' => 'Teknik Informatika',
            'angkatan' => '2023',
        ]);

        $anggota2 = User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'budi@unipma.ac.id',
            'role' => 'anggota',
            'nim' => '2305101011',
            'jurusan' => 'Manajemen',
            'angkatan' => '2024',
        ]);

        $anggota3 = User::factory()->create([
            'name' => 'Dewi Anggraini',
            'email' => 'dewi@unipma.ac.id',
            'role' => 'anggota',
            'nim' => '2305101012',
            'jurusan' => 'Akuntansi',
            'angkatan' => '2024',
        ]);

        $anggota4 = User::factory()->create([
            'name' => 'Andi Prasetyo',
            'email' => 'andi@unipma.ac.id',
            'role' => 'anggota',
            'nim' => '2305101013',
            'jurusan' => 'Teknik Informatika',
            'angkatan' => '2025',
        ]);

        $anggota5 = User::factory()->create([
            'name' => 'Rina Wulandari',
            'email' => 'rina@unipma.ac.id',
            'role' => 'anggota',
            'nim' => '2305101014',
            'jurusan' => 'Pendidikan Bahasa Inggris',
            'angkatan' => '2025',
        ]);

        // Seed organisasi
        $this->call(OrganisasiSeeder::class);

        // Seed keanggotaan, kegiatan, pengumuman
        $this->call(AnggotaOrganisasiSeeder::class);
        $this->call(KegiatanSeeder::class);
        $this->call(PengumumanSeeder::class);
    }
}
