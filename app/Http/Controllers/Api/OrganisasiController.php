<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganisasiController extends Controller
{
    /**
     * Menampilkan daftar semua Organisasi/UKM.
     */
    public function index(): JsonResponse
    {
        // Mengambil semua data UKM dari database
        $organisasis = Organisasi::all();

        return response()->json([
            'success' => true,
            'message' => 'Daftar UKM berhasil diambil.',
            'data' => $organisasis
        ]);
    }

    /**
     * Menampilkan detail spesifik satu UKM berdasarkan ID.
     */
    public function show($id): JsonResponse
    {
        $organisasi = Organisasi::find($id);

        if (!$organisasi) {
            return response()->json([
                'success' => false,
                'message' => 'UKM tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail UKM berhasil diambil.',
            'data' => $organisasi
        ]);
    }
}
