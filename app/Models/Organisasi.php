<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organisasi extends Model
{
    protected $fillable = [
        'name',
        'category',
        'ketua',
        'visi',
        'misi',
    ];
}
