<?php

use App\Models\Organisasi;
use App\Models\User;

test('api returns organisasi list', function () {
    Organisasi::factory()->count(3)->aktif()->create();

    $response = $this->getJson('/api/organisasi');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'category', 'ketua', 'visi', 'status'],
            ],
        ]);
});

test('api returns single organisasi detail', function () {
    $org = Organisasi::factory()->aktif()->create();

    $response = $this->getJson("/api/organisasi/{$org->id}");

    $response->assertStatus(200)
        ->assertJsonPath('data.id', $org->id)
        ->assertJsonPath('data.name', $org->name);
});

test('api login returns token', function () {
    $user = User::factory()->create(['password' => bcrypt('password123')]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => ['user', 'token'],
        ]);
});

test('api login fails with wrong credentials', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
        ->assertJsonPath('success', false);
});

test('api me returns authenticated user', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/me');

    $response->assertStatus(200)
        ->assertJsonPath('data.user.id', $user->id);
});

test('api protected routes require auth', function () {
    $response = $this->getJson('/api/me');

    $response->assertStatus(401);
});
