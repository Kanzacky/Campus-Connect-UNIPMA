<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganisasiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'ketua' => $this->ketua,
            'visi' => $this->visi,
            'misi' => $this->misi,
            'deskripsi' => $this->deskripsi,
            'logo' => $this->logo,
            'kontak' => $this->kontak,
            'status' => $this->status,
            'anggota_aktif_count' => $this->whenCounted('anggotaAktif'),
            'kegiatans' => KegiatanResource::collection($this->whenLoaded('kegiatans')),
            'pengumumans' => PengumumanResource::collection($this->whenLoaded('pengumumans')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
