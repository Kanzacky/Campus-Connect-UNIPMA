<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminKegiatanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Kegiatan::with(['organisasi:id,name', 'creator:id,name']);

        if ($request->filled('search')) {
            $query->where('judul', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $kegiatans = $query->latest()->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => [
                'kegiatans' => $kegiatans,
                'filters' => $request->only(['search', 'status']),
            ],
        ]);
    }
}
