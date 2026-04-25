<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'nim' => $this->nim,
            'jurusan' => $this->jurusan,
            'angkatan' => $this->angkatan,
            'no_hp' => $this->when($request->user()?->isAdmin() || $request->user()?->id === $this->id, $this->no_hp),
            'avatar' => $this->avatar,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
