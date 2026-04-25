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
        Schema::table('organisasis', function (Blueprint $table) {
            $table->text('deskripsi')->nullable()->after('misi');
            $table->string('logo')->nullable()->after('deskripsi');
            $table->string('kontak')->nullable()->after('logo');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif')->after('kontak');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organisasis', function (Blueprint $table) {
            $table->dropColumn(['deskripsi', 'logo', 'kontak', 'status']);
        });
    }
};
