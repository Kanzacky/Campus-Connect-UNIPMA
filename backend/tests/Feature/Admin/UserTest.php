<?php

use App\Models\User;

test('admin can view users list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(5)->create(['role' => 'anggota']);

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/index')
        ->has('users.data')
        ->has('filters')
    );
});

test('admin can create user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post('/admin/users', [
        'name' => 'Test User',
        'email' => 'testuser@unipma.ac.id',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'anggota',
    ]);

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseHas('users', ['email' => 'testuser@unipma.ac.id', 'role' => 'anggota']);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

    $response->assertRedirect();
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('non-admin cannot access admin users', function () {
    $pengurus = User::factory()->create(['role' => 'pengurus']);

    $response = $this->actingAs($pengurus)->get('/admin/users');

    $response->assertStatus(403);
});
