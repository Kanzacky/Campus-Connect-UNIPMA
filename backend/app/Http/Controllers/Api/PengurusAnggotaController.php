<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PengurusAnggotaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $orgIds = $user->organisasis()->wherePivot('status', 'aktif')->pluck('organisasis.id');

        $organisasis = Organisasi::whereIn('id', $orgIds)->get(['id', 'name']);

        $selectedOrgId = $request->input('organisasi_id', $orgIds->first());

        $query = DB::table('anggota_organisasi')
            ->join('users', 'anggota_organisasi.user_id', '=', 'users.id')
            ->where('anggota_organisasi.organisasi_id', $selectedOrgId)
            ->select(
                'anggota_organisasi.id',
                'anggota_organisasi.user_id',
                'anggota_organisasi.organisasi_id',
                'anggota_organisasi.jabatan',
                'anggota_organisasi.status',
                'anggota_organisasi.bergabung_pada',
                'anggota_organisasi.created_at',
                'users.name',
                'users.email',
                'users.nim',
                'users.jurusan',
                'users.angkatan'
            );

        if ($request->filled('status')) {
            $query->where('anggota_organisasi.status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('users.nim', 'like', "%{$search}%");
            });
        }

        $anggota = $query->orderByDesc('anggota_organisasi.created_at')->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => [
                'anggota' => $anggota,
                'organisasis' => $organisasis,
                'selectedOrgId' => (int) $selectedOrgId,
                'filters' => $request->only(['search', 'status', 'organisasi_id']),
            ],
        ]);
    }

    public function approve(Request $request, $id): JsonResponse
    {
        $membership = DB::table('anggota_organisasi')->where('id', $id)->first();

        if (! $membership) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }

        $user = $request->user();
        $manages = $user->organisasis()->wherePivot('status', 'aktif')->where('organisasis.id', $membership->organisasi_id)->exists();

        if (! $manages) {
            return response()->json(['success' => false, 'message' => 'Anda tidak memiliki akses.'], 403);
        }

        DB::table('anggota_organisasi')->where('id', $id)->update([
            'status' => 'aktif',
            'bergabung_pada' => now()->toDateString(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Anggota berhasil disetujui.',
        ]);
    }

    public function reject(Request $request, $id): JsonResponse
    {
        $membership = DB::table('anggota_organisasi')->where('id', $id)->first();

        if (! $membership) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }

        $user = $request->user();
        $manages = $user->organisasis()->wherePivot('status', 'aktif')->where('organisasis.id', $membership->organisasi_id)->exists();

        if (! $manages) {
            return response()->json(['success' => false, 'message' => 'Anda tidak memiliki akses.'], 403);
        }

        DB::table('anggota_organisasi')->where('id', $id)->update([
            'status' => 'ditolak',
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran ditolak.',
        ]);
    }

    public function remove(Request $request, $id): JsonResponse
    {
        $membership = DB::table('anggota_organisasi')->where('id', $id)->first();

        if (! $membership) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }

        $user = $request->user();
        $manages = $user->organisasis()->wherePivot('status', 'aktif')->where('organisasis.id', $membership->organisasi_id)->exists();

        if (! $manages) {
            return response()->json(['success' => false, 'message' => 'Anda tidak memiliki akses.'], 403);
        }

        DB::table('anggota_organisasi')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Anggota berhasil dihapus.',
        ]);
    }
}
