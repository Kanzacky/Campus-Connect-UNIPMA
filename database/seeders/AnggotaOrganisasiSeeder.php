<?php

namespace Database\Seeders;

use App\Models\Organisasi;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnggotaOrganisasiSeeder extends Seeder
{
    /**
     * Hubungkan user ke organisasi dengan berbagai status.
     */
    public function run(): void
    {
        $pengurus1 = User::where('email', 'rafli@unipma.ac.id')->first();
        $pengurus2 = User::where('email', 'raka@unipma.ac.id')->first();
        $pengurus3 = User::where('email', 'fajar@unipma.ac.id')->first();

        $anggota1 = User::where('email', 'siti@unipma.ac.id')->first();
        $anggota2 = User::where('email', 'budi@unipma.ac.id')->first();
        $anggota3 = User::where('email', 'dewi@unipma.ac.id')->first();
        $anggota4 = User::where('email', 'andi@unipma.ac.id')->first();
        $anggota5 = User::where('email', 'rina@unipma.ac.id')->first();

        $bem = Organisasi::where('name', 'BEM (Badan Eksekutif Mahasiswa)')->first();
        $ukmSeni = Organisasi::where('name', 'UKM Seni')->first();
        $futsal = Organisasi::where('name', 'UKM Futsal')->first();
        $kim = Organisasi::where('name', 'Kelompok Ilmiah Mahasiswa (KIM)')->first();

        if (! $bem || ! $ukmSeni || ! $futsal || ! $kim) {
            return;
        }

        // Pengurus sebagai Ketua di organisasinya
        $bem->anggota()->attach($pengurus1->id, [
            'jabatan' => 'Ketua',
            'status' => 'aktif',
            'bergabung_pada' => '2025-09-01',
        ]);

        $ukmSeni->anggota()->attach($pengurus2->id, [
            'jabatan' => 'Ketua',
            'status' => 'aktif',
            'bergabung_pada' => '2025-09-01',
        ]);

        $futsal->anggota()->attach($pengurus3->id, [
            'jabatan' => 'Ketua',
            'status' => 'aktif',
            'bergabung_pada' => '2025-09-01',
        ]);

        // Anggota aktif
        $bem->anggota()->attach($anggota1->id, [
            'jabatan' => 'Anggota',
            'status' => 'aktif',
            'bergabung_pada' => '2025-10-15',
        ]);

        $bem->anggota()->attach($anggota2->id, [
            'jabatan' => 'Sekretaris',
            'status' => 'aktif',
            'bergabung_pada' => '2025-09-05',
        ]);

        $ukmSeni->anggota()->attach($anggota3->id, [
            'jabatan' => 'Anggota',
            'status' => 'aktif',
            'bergabung_pada' => '2025-11-01',
        ]);

        $futsal->anggota()->attach($anggota4->id, [
            'jabatan' => 'Anggota',
            'status' => 'aktif',
            'bergabung_pada' => '2026-02-10',
        ]);

        // Pendaftar pending
        $kim->anggota()->attach($anggota5->id, [
            'jabatan' => 'Anggota',
            'status' => 'pending',
            'bergabung_pada' => null,
        ]);

        $futsal->anggota()->attach($anggota1->id, [
            'jabatan' => 'Anggota',
            'status' => 'pending',
            'bergabung_pada' => null,
        ]);
    }
}
