<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicPostController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::get('/', function () {
    return response()->json(['message' => 'Welcome to the API'], 200);
});
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
// 認証が必要なルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('dashboard', function () {
        return response()->json(['message' => 'Welcome to the dashboard']);
    });

    // 認証が必要なリソースルート
    Route::resource('posts', PostController::class);
    Route::resource('locations', LocationController::class);
});
Route::get('/public/posts/latest', [PublicPostController::class, 'latestPosts']);