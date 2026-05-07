<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Organisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PengurusDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $organisasis = $user->organisasis()
            ->wherePivot('status', 'aktif')
            ->withCount(['anggotaAktif', 'pendaftar', 'kegiatans', 'pengumumans'])
            ->get();

        $orgIds = $organisasis->pluck('id');

        $kegiatanMendatang = Kegiatan::whereIn('organisasi_id', $orgIds)
            ->where('tanggal_mulai', '>=', now())
            ->where('status', 'published')
            ->with('organisasi:id,name')
            ->orderBy('tanggal_mulai')
            ->take(5)
            ->get();

        $pendaftarBaru = collect();
        foreach ($organisasis as $org) {
            $pending = $org->pendaftar()
                ->select('users.id', 'users.name', 'users.email', 'users.nim')
                ->latest('anggota_organisasi.created_at')
                ->take(5)
                ->get()
                ->map(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'nim' => $u->nim,
                    'organisasi' => $org->name,
                    'organisasi_id' => $org->id,
                ]);
            $pendaftarBaru = $pendaftarBaru->merge($pending);
        }

        // Pendaftar per organisasi (pending) agar dashboard bisa menampilkan per-UKM.
        $pendaftarByOrganisasi = $organisasis->map(function ($org) {
            $list = $org->pendaftar()
                ->select('users.id', 'users.name', 'users.email', 'users.nim')
                ->latest('anggota_organisasi.created_at')
                ->take(10)
                ->get()
                ->map(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'nim' => $u->nim,
                ]);

            return [
                'organisasi_id' => $org->id,
                'organisasi' => $org->name,
                'category' => $org->category,
                'pendaftar_count' => $org->pendaftar_count ?? $list->count(),
                'pendaftar' => $list,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'organisasis' => $organisasis,
                'kegiatanMendatang' => $kegiatanMendatang,
                'pendaftarBaru' => $pendaftarBaru->take(10)->values(),
                'pendaftarByOrganisasi' => $pendaftarByOrganisasi,
            ],
        ]);
    }
}
