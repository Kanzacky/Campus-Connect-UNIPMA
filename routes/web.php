<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Fortify\Features;

use Inertia\Inertia;
use App\Models\Organisasi;

Route::get('/', function () {
    $ormawa = Organisasi::where('category', 'Organisasi Tingkat Universitas/Fakultas')->take(3)->get();
    $ukm = Organisasi::where('category', '!=', 'Organisasi Tingkat Universitas/Fakultas')->take(3)->get();
    
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'organisasis' => $ormawa->concat($ukm),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $role = $request->user()->role;
        
        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'pengurus' => redirect()->route('pengurus.dashboard'),
            default => redirect()->route('anggota.dashboard'),
        };
    })->name('dashboard');

    Route::inertia('admin', 'admin/dashboard')->name('admin.dashboard');
    Route::inertia('pengurus/dashboard', 'pengurus/dashboard')->name('pengurus.dashboard');
    Route::inertia('anggota/dashboard', 'anggota/dashboard')->name('anggota.dashboard');
});

require __DIR__.'/settings.php';
