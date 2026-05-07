<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnggotaKegiatanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $orgIds = $user->organisasis()->wherePivot('status', 'aktif')->pluck('organisasis.id');

        $query = Kegiatan::whereIn('organisasi_id', $orgIds)
            ->where('status', 'published')
            ->with('organisasi:id,name');

        if ($request->filled('search')) {
            $query->where('judul', 'like', '%'.$request->search.'%');
        }

        $kegiatans = $query->orderBy('tanggal_mulai', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => [
                'kegiatans' => $kegiatans,
                'filters' => $request->only(['search']),
            ],
        ]);
    }
}
