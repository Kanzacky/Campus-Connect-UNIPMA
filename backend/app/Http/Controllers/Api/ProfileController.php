<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class ProfileController extends Controller
{
    /**
     * Get the user's profile data.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($request->user()),
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$request->user()->id,
            'nim' => 'nullable|string|max:20|unique:users,nim,'.$request->user()->id,
            'jurusan' => 'nullable|string|max:255',
            'angkatan' => 'nullable|string|max:4',
            'no_hp' => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => new UserResource($user->fresh()),
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diperbarui.',
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|current_password',
        ]);

        $user = $request->user();

        // Revoke all tokens
        $user->tokens()->delete();

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dihapus.',
        ]);
    }
}
