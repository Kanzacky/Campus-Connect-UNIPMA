<?php

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminKegiatanController;
use App\Http\Controllers\Api\AdminOrganisasiController;
use App\Http\Controllers\Api\AdminPengumumanController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AnggotaDashboardController;
use App\Http\Controllers\Api\AnggotaKegiatanController;
use App\Http\Controllers\Api\AnggotaOrganisasiController;
use App\Http\Controllers\Api\AnggotaPengumumanController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrganisasiController;
use App\Http\Controllers\Api\PengurusAnggotaController;
use App\Http\Controllers\Api\PengurusDashboardController;
use App\Http\Controllers\Api\PengurusKegiatanController;
use App\Http\Controllers\Api\PengurusPengumumanController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Semua route API untuk Campus Connect UNIPMA.
| Prefix: /api
| Auth: Laravel Sanctum (Bearer Token)
|
*/

// ==================== PUBLIC ROUTES ====================
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/register', [AuthController::class, 'register'])->name('api.register');

// Public organisasi listing
Route::get('/organisasi', [OrganisasiController::class, 'index'])->name('api.organisasi.index');
Route::get('/organisasi/{organisasi}', [OrganisasiController::class, 'show'])->name('api.organisasi.show');

// ==================== PROTECTED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me', [AuthController::class, 'me'])->name('api.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    // Profile & Settings
    Route::get('/profile', [ProfileController::class, 'show'])->name('api.profile.show');
    Route::put('/profile', [ProfileController::class, 'update'])->name('api.profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('api.profile.password');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('api.profile.destroy');

    // ==================== ADMIN ROUTES ====================
    Route::middleware('role:admin')->prefix('admin')->name('api.admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // CRUD Organisasi
        Route::apiResource('organisasi', AdminOrganisasiController::class);

        // CRUD Users
        Route::apiResource('users', AdminUserController::class);

        // Kegiatan (read-only overview)
        Route::get('/kegiatan', [AdminKegiatanController::class, 'index'])->name('kegiatan.index');

        // CRUD Pengumuman
        Route::apiResource('pengumuman', AdminPengumumanController::class);
    });

    // ==================== PENGURUS ROUTES ====================
    Route::middleware('role:pengurus')->prefix('pengurus')->name('api.pengurus.')->group(function () {
        Route::get('/dashboard', [PengurusDashboardController::class, 'index'])->name('dashboard');

        // Kelola Anggota
        Route::get('/anggota', [PengurusAnggotaController::class, 'index'])->name('anggota.index');
        Route::put('/anggota/{id}/approve', [PengurusAnggotaController::class, 'approve'])->name('anggota.approve');
        Route::put('/anggota/{id}/reject', [PengurusAnggotaController::class, 'reject'])->name('anggota.reject');
        Route::delete('/anggota/{id}/remove', [PengurusAnggotaController::class, 'remove'])->name('anggota.remove');

        // CRUD Kegiatan
        Route::apiResource('kegiatan', PengurusKegiatanController::class);

        // CRUD Pengumuman
        Route::apiResource('pengumuman', PengurusPengumumanController::class);
    });

    // ==================== ANGGOTA ROUTES ====================
    Route::middleware('role:anggota')->prefix('anggota')->name('api.anggota.')->group(function () {
        Route::get('/dashboard', [AnggotaDashboardController::class, 'index'])->name('dashboard');

        // Browse & Gabung Organisasi
        Route::get('/organisasi', [AnggotaOrganisasiController::class, 'index'])->name('organisasi.index');
        Route::get('/organisasi/{id}', [AnggotaOrganisasiController::class, 'show'])->name('organisasi.show');
        Route::post('/organisasi/{id}/join', [AnggotaOrganisasiController::class, 'join'])->name('organisasi.join');
        Route::delete('/organisasi/{id}/leave', [AnggotaOrganisasiController::class, 'leave'])->name('organisasi.leave');

        // Kegiatan
        Route::get('/kegiatan', [AnggotaKegiatanController::class, 'index'])->name('kegiatan.index');

        // Pengumuman
        Route::get('/pengumuman', [AnggotaPengumumanController::class, 'index'])->name('pengumuman.index');
    });
});
