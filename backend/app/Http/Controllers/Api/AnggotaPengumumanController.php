<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnggotaPengumumanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $orgIds = $user->organisasis()->wherePivot('status', 'aktif')->pluck('organisasis.id');

        $query = Pengumuman::where(function ($q) use ($orgIds) {
            $q->whereNull('organisasi_id')
                ->orWhereIn('organisasi_id', $orgIds);
        })->with(['organisasi:id,name', 'creator:id,name']);

        if ($request->filled('search')) {
            $query->where('judul', 'like', '%'.$request->search.'%');
        }

        $pengumumans = $query->orderByDesc('is_pinned')->latest()->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => [
                'pengumumans' => $pengumumans,
                'filters' => $request->only(['search']),
            ],
        ]);
    }
}
