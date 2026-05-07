<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Pengumuman;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnggotaDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $organisasiSaya = $user->organisasis()
            ->wherePivot('status', 'aktif')
            ->withCount('anggotaAktif')
            ->get();

        $orgIds = $organisasiSaya->pluck('id');

        $kegiatanMendatang = Kegiatan::whereIn('organisasi_id', $orgIds)
            ->where('tanggal_mulai', '>=', now())
            ->where('status', 'published')
            ->with('organisasi:id,name')
            ->orderBy('tanggal_mulai')
            ->take(5)
            ->get();

        $pengumumanTerbaru = Pengumuman::where(function ($q) use ($orgIds) {
            $q->whereNull('organisasi_id')
                ->orWhereIn('organisasi_id', $orgIds);
        })
            ->with('organisasi:id,name')
            ->latest()
            ->take(5)
            ->get();

        $pendingOrgs = $user->organisasis()
            ->wherePivot('status', 'pending')
            ->get(['organisasis.id', 'organisasis.name']);

        return response()->json([
            'success' => true,
            'data' => [
                'organisasiSaya' => $organisasiSaya,
                'kegiatanMendatang' => $kegiatanMendatang,
                'pengumumanTerbaru' => $pengumumanTerbaru,
                'pendingOrgs' => $pendingOrgs,
            ],
        ]);
    }
}
