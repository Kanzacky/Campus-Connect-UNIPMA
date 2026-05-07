<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Backend sekarang murni API. Web routes hanya untuk health check
| dan redirect ke frontend.
|
*/

Route::get('/', function () {
    return response()->json([
        'app' => config('app.name', 'Campus Connect UNIPMA'),
        'version' => '2.0.0',
        'message' => 'API is running. Use /api/* endpoints.',
    ]);
});
