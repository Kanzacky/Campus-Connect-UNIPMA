<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrganisasiResource;
use App\Models\Organisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrganisasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Organisasi::withCount('anggotaAktif');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $organisasis = $query->latest()->paginate($request->input('per_page', 10));
        $categories = Organisasi::distinct()->pluck('category');

        return response()->json([
            'success' => true,
            'data' => [
                'organisasis' => $organisasis,
                'categories' => $categories,
                'filters' => $request->only(['search', 'category', 'status']),
            ],
        ]);
    }

    public function show(Organisasi $organisasi): JsonResponse
    {
        $organisasi->loadCount('anggotaAktif');
        $categories = Organisasi::distinct()->pluck('category');

        return response()->json([
            'success' => true,
            'data' => [
                'organisasi' => new OrganisasiResource($organisasi),
                'categories' => $categories,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'ketua' => 'required|string|max:255',
            'visi' => 'required|string',
            'misi' => 'required|string',
            'deskripsi' => 'nullable|string',
            'kontak' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $organisasi = Organisasi::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Organisasi berhasil ditambahkan.',
            'data' => new OrganisasiResource($organisasi),
        ], 201);
    }

    public function update(Request $request, Organisasi $organisasi): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'ketua' => 'required|string|max:255',
            'visi' => 'required|string',
            'misi' => 'required|string',
            'deskripsi' => 'nullable|string',
            'kontak' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $organisasi->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Organisasi berhasil diperbarui.',
            'data' => new OrganisasiResource($organisasi->fresh()),
        ]);
    }

    public function destroy(Organisasi $organisasi): JsonResponse
    {
        $organisasi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Organisasi berhasil dihapus.',
        ]);
    }
}
