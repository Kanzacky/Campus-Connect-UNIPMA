<?php

use App\Models\Organisasi;
use App\Models\User;

test('admin can view organisasi list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Organisasi::factory()->count(3)->aktif()->create();

    $response = $this->actingAs($admin)->get('/admin/organisasi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/organisasi/index')
        ->has('organisasis.data', 3)
        ->has('categories')
        ->has('filters')
    );
});

test('admin can create organisasi', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post('/admin/organisasi', [
        'name' => 'UKM Testing',
        'category' => 'Seni dan Kebudayaan',
        'ketua' => 'John Doe',
        'visi' => 'Visi testing',
        'misi' => 'Misi testing',
        'status' => 'aktif',
    ]);

    $response->assertRedirect('/admin/organisasi');
    $this->assertDatabaseHas('organisasis', ['name' => 'UKM Testing']);
});

test('admin can update organisasi', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $org = Organisasi::factory()->create();

    $response = $this->actingAs($admin)->put("/admin/organisasi/{$org->id}", [
        'name' => 'Updated Name',
        'category' => $org->category,
        'ketua' => $org->ketua,
        'visi' => $org->visi,
        'misi' => $org->misi,
        'status' => 'aktif',
    ]);

    $response->assertRedirect('/admin/organisasi');
    $this->assertDatabaseHas('organisasis', ['id' => $org->id, 'name' => 'Updated Name']);
});

test('admin can delete organisasi', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $org = Organisasi::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/organisasi/{$org->id}");

    $response->assertRedirect('/admin/organisasi');
    $this->assertDatabaseMissing('organisasis', ['id' => $org->id]);
});

test('non-admin cannot access admin organisasi', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);

    $response = $this->actingAs($anggota)->get('/admin/organisasi');

    $response->assertStatus(403);
});

test('guest cannot access admin organisasi', function () {
    $response = $this->get('/admin/organisasi');

    $response->assertRedirect('/login');
});
