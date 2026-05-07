<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Organisasi;
use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalAdmin' => User::where('role', 'admin')->count(),
            'totalPengurus' => User::where('role', 'pengurus')->count(),
            'totalAnggota' => User::where('role', 'anggota')->count(),
            'totalOrganisasi' => Organisasi::count(),
            'organisasiAktif' => Organisasi::where('status', 'aktif')->count(),
            'totalKegiatan' => Kegiatan::count(),
            'kegiatanBulanIni' => Kegiatan::whereMonth('tanggal_mulai', now()->month)
                ->whereYear('tanggal_mulai', now()->year)
                ->count(),
            'totalPengumuman' => Pengumuman::count(),
            'pendaftarBaru' => User::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        $recentUsers = User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']);
        $recentKegiatan = Kegiatan::with('organisasi:id,name')
            ->latest()
            ->take(5)
            ->get(['id', 'judul', 'organisasi_id', 'status', 'tanggal_mulai', 'created_at']);

        // Snapshot organisasi + pendaftar (pending) per organisasi untuk ringkasan admin.
        $organisasiOverview = Organisasi::query()
            ->latest()
            ->withCount(['anggotaAktif', 'pendaftar'])
            ->with([
                'pendaftar' => function ($q) {
                    $q->select('users.id', 'users.name', 'users.email', 'users.nim')
                        ->latest('anggota_organisasi.created_at')
                        ->take(5);
                },
            ])
            ->take(9)
            ->get(['id', 'name', 'category', 'status', 'ketua']);

        // Admin: tampilkan daftar user (ringkas) untuk dashboard, full list tetap via /admin/users.
        $usersSnapshot = User::query()
            ->latest()
            ->take(25)
            ->get(['id', 'name', 'email', 'role', 'nim', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recentUsers' => $recentUsers,
                'recentKegiatan' => $recentKegiatan,
                'organisasiOverview' => $organisasiOverview,
                'usersSnapshot' => $usersSnapshot,
            ],
        ]);
    }
}
