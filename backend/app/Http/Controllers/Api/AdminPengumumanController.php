<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PengumumanResource;
use App\Models\Pengumuman;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPengumumanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Pengumuman::with(['organisasi:id,name', 'creator:id,name']);

        if ($request->filled('search')) {
            $query->where('judul', 'like', '%'.$request->search.'%');
        }

        $pengumumans = $query->latest()->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => [
                'pengumumans' => $pengumumans,
                'filters' => $request->only(['search']),
            ],
        ]);
    }

    public function show(Pengumuman $pengumuman): JsonResponse
    {
        $pengumuman->load(['organisasi:id,name', 'creator:id,name']);

        return response()->json([
            'success' => true,
            'data' => new PengumumanResource($pengumuman),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'is_pinned' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['organisasi_id'] = null;

        $pengumuman = Pengumuman::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dibuat.',
            'data' => new PengumumanResource($pengumuman->load(['organisasi:id,name', 'creator:id,name'])),
        ], 201);
    }

    public function update(Request $request, Pengumuman $pengumuman): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'is_pinned' => 'boolean',
        ]);

        $pengumuman->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil diperbarui.',
            'data' => new PengumumanResource($pengumuman->fresh()->load(['organisasi:id,name', 'creator:id,name'])),
        ]);
    }

    public function destroy(Pengumuman $pengumuman): JsonResponse
    {
        $pengumuman->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus.',
        ]);
    }
}
