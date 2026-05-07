<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'nim', 'jurusan', 'angkatan', 'no_hp', 'avatar'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Organisasi yang diikuti oleh user ini.
     */
    public function organisasis(): BelongsToMany
    {
        return $this->belongsToMany(Organisasi::class, 'anggota_organisasi')
            ->withPivot('jabatan', 'status', 'bergabung_pada')
            ->withTimestamps();
    }

    /**
     * Kegiatan yang dibuat oleh user ini.
     */
    public function kegiatans(): HasMany
    {
        return $this->hasMany(Kegiatan::class, 'created_by');
    }

    /**
     * Pengumuman yang dibuat oleh user ini.
     */
    public function pengumumans(): HasMany
    {
        return $this->hasMany(Pengumuman::class, 'created_by');
    }

    /**
     * Cek apakah user memiliki role tertentu.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Cek apakah user adalah admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Cek apakah user adalah pengurus.
     */
    public function isPengurus(): bool
    {
        return $this->hasRole('pengurus');
    }

    /**
     * Cek apakah user adalah anggota.
     */
    public function isAnggota(): bool
    {
        return $this->hasRole('anggota');
    }
}
