<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organisasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'ketua',
        'visi',
        'misi',
        'deskripsi',
        'logo',
        'kontak',
        'status',
    ];

    /**
     * Anggota-anggota dari organisasi ini.
     */
    public function anggota(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'anggota_organisasi')
            ->withPivot('jabatan', 'status', 'bergabung_pada')
            ->withTimestamps();
    }

    /**
     * Anggota aktif dari organisasi ini.
     */
    public function anggotaAktif(): BelongsToMany
    {
        return $this->anggota()->wherePivot('status', 'aktif');
    }

    /**
     * Pendaftar yang menunggu persetujuan.
     */
    public function pendaftar(): BelongsToMany
    {
        return $this->anggota()->wherePivot('status', 'pending');
    }

    /**
     * Kegiatan milik organisasi ini.
     */
    public function kegiatans(): HasMany
    {
        return $this->hasMany(Kegiatan::class);
    }

    /**
     * Pengumuman milik organisasi ini.
     */
    public function pengumumans(): HasMany
    {
        return $this->hasMany(Pengumuman::class);
    }
}
