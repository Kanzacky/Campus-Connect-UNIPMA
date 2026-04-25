<?php

use App\Models\Organisasi;
use App\Models\User;

test('anggota can browse active organisations', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);
    Organisasi::factory()->count(5)->aktif()->create();
    Organisasi::factory()->count(2)->nonaktif()->create();

    $response = $this->actingAs($anggota)->get('/anggota/organisasi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('anggota/organisasi/index')
        ->has('organisasis.data', 5) // only active ones
        ->has('userMemberships')
    );
});

test('anggota can join an organisation', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);
    $org = Organisasi::factory()->aktif()->create();

    $response = $this->actingAs($anggota)->post("/anggota/organisasi/{$org->id}/join");

    $response->assertRedirect();
    $this->assertDatabaseHas('anggota_organisasi', [
        'user_id' => $anggota->id,
        'organisasi_id' => $org->id,
        'status' => 'pending',
    ]);
});

test('anggota cannot join same organisation twice', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);
    $org = Organisasi::factory()->aktif()->create();

    // First join
    $this->actingAs($anggota)->post("/anggota/organisasi/{$org->id}/join");

    // Second join
    $response = $this->actingAs($anggota)->post("/anggota/organisasi/{$org->id}/join");

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('anggota can leave an organisation', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);
    $org = Organisasi::factory()->aktif()->create();

    $org->anggota()->attach($anggota->id, ['jabatan' => 'Anggota', 'status' => 'aktif', 'bergabung_pada' => now()]);

    $response = $this->actingAs($anggota)->delete("/anggota/organisasi/{$org->id}/leave");

    $response->assertRedirect();
    $this->assertDatabaseMissing('anggota_organisasi', [
        'user_id' => $anggota->id,
        'organisasi_id' => $org->id,
    ]);
});

test('anggota can view their dashboard', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);

    $response = $this->actingAs($anggota)->get('/anggota/dashboard');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('anggota/dashboard')
        ->has('organisasiSaya')
        ->has('kegiatanMendatang')
        ->has('pengumumanTerbaru')
        ->has('pendingOrgs')
    );
});
