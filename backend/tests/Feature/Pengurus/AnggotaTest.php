<?php

use App\Models\Organisasi;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('pengurus can view their anggota', function () {
    $pengurus = User::factory()->create(['role' => 'pengurus']);
    $org = Organisasi::factory()->aktif()->create();

    // Attach pengurus to org
    $org->anggota()->attach($pengurus->id, ['jabatan' => 'Ketua', 'status' => 'aktif', 'bergabung_pada' => now()]);

    $response = $this->actingAs($pengurus)->get('/pengurus/anggota');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('pengurus/anggota/index')
        ->has('anggota')
        ->has('organisasis')
    );
});

test('pengurus can approve pending member', function () {
    $pengurus = User::factory()->create(['role' => 'pengurus']);
    $anggota = User::factory()->create(['role' => 'anggota']);
    $org = Organisasi::factory()->aktif()->create();

    $org->anggota()->attach($pengurus->id, ['jabatan' => 'Ketua', 'status' => 'aktif', 'bergabung_pada' => now()]);

    $membershipId = DB::table('anggota_organisasi')->insertGetId([
        'user_id' => $anggota->id,
        'organisasi_id' => $org->id,
        'jabatan' => 'Anggota',
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($pengurus)->put("/pengurus/anggota/{$membershipId}/approve");

    $response->assertRedirect();
    $this->assertDatabaseHas('anggota_organisasi', ['id' => $membershipId, 'status' => 'aktif']);
});

test('pengurus can reject pending member', function () {
    $pengurus = User::factory()->create(['role' => 'pengurus']);
    $anggota = User::factory()->create(['role' => 'anggota']);
    $org = Organisasi::factory()->aktif()->create();

    $org->anggota()->attach($pengurus->id, ['jabatan' => 'Ketua', 'status' => 'aktif', 'bergabung_pada' => now()]);

    $membershipId = DB::table('anggota_organisasi')->insertGetId([
        'user_id' => $anggota->id,
        'organisasi_id' => $org->id,
        'jabatan' => 'Anggota',
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($pengurus)->put("/pengurus/anggota/{$membershipId}/reject");

    $response->assertRedirect();
    $this->assertDatabaseHas('anggota_organisasi', ['id' => $membershipId, 'status' => 'ditolak']);
});

test('anggota cannot access pengurus routes', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);

    $response = $this->actingAs($anggota)->get('/pengurus/anggota');

    $response->assertStatus(403);
});
