<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('anggota_organisasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('organisasi_id')->constrained('organisasis')->cascadeOnDelete();
            $table->string('jabatan')->default('Anggota');
            $table->enum('status', ['pending', 'aktif', 'ditolak'])->default('pending');
            $table->date('bergabung_pada')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'organisasi_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggota_organisasi');
    }
};
