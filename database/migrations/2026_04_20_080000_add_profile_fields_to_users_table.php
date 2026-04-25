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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nim')->nullable()->unique()->after('role');
            $table->string('jurusan')->nullable()->after('nim');
            $table->string('angkatan')->nullable()->after('jurusan');
            $table->string('no_hp')->nullable()->after('angkatan');
            $table->string('avatar')->nullable()->after('no_hp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nim', 'jurusan', 'angkatan', 'no_hp', 'avatar']);
        });
    }
};
