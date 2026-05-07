<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KegiatanResource;
use App\Models\Kegiatan;
use App\Models\Organisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PengurusKegiatanController extends Controller
{
    private function getOrgIds(Request $request)
    {
        return $request->user()->organisasis()->wherePivot('status', 'aktif')->pluck('organisasis.id');
    }

    public function index(Request $request): JsonResponse
    {
        $orgIds = $this->getOrgIds($request);

        $query = Kegiatan::whereIn('organisasi_id', $orgIds)->with('organisasi:id,name');

        if ($request->filled('search')) {
            $query->where('judul', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $kegiatans = $query->latest()->paginate($request->input('per_page', 10));
        $organisasis = Organisasi::whereIn('id', $orgIds)->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => [
                'kegiatans' => $kegiatans,
                'organisasis' => $organisasis,
                'filters' => $request->only(['search', 'status']),
            ],
        ]);
    }

    public function show(Kegiatan $kegiatan, Request $request): JsonResponse
    {
        $orgIds = $this->getOrgIds($request);

        if (! $orgIds->contains($kegiatan->organisasi_id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $kegiatan->load('organisasi:id,name');
        $organisasis = Organisasi::whereIn('id', $orgIds)->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => [
                'kegiatan' => new KegiatanResource($kegiatan),
                'organisasis' => $organisasis,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $orgIds = $this->getOrgIds($request);

        $validated = $request->validate([
            'organisasi_id' => 'required|exists:organisasis,id|in:'.$orgIds->implode(','),
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
        ]);

        $validated['created_by'] = auth()->id();

        $kegiatan = Kegiatan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil dibuat.',
            'data' => new KegiatanResource($kegiatan->load('organisasi:id,name')),
        ], 201);
    }

    public function update(Request $request, Kegiatan $kegiatan): JsonResponse
    {
        $orgIds = $this->getOrgIds($request);

        if (! $orgIds->contains($kegiatan->organisasi_id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $validated = $request->validate([
            'organisasi_id' => 'required|exists:organisasis,id|in:'.$orgIds->implode(','),
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'required|string|max:255',
            'status' => 'required|in:draft,published,selesai',
        ]);

        $kegiatan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil diperbarui.',
            'data' => new KegiatanResource($kegiatan->fresh()->load('organisasi:id,name')),
        ]);
    }

    public function destroy(Request $request, Kegiatan $kegiatan): JsonResponse
    {
        $orgIds = $this->getOrgIds($request);

        if (! $orgIds->contains($kegiatan->organisasi_id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $kegiatan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil dihapus.',
        ]);
    }
}
