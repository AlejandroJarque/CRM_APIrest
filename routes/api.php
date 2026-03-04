<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\ActivityController;

// Auth (public)
Route::post('/login',fn() => response()->json(['message' => 'login endpoint'], 200));
Route::post('/register', fn() => response()->json(['message' => 'register endpoint'], 200));

// Authenticated routes
Route::middleware('auth:api')->group(function() {

    Route::get('/me', fn() => response()->json(['message' => 'me endpoint'], 200));

    // Profile
    Route::get('/profile', fn() => response()->json(['message' => 'profile endpoint'], 200));
    Route::patch('/profile', fn() => response()->json(['message' => 'profile update endpoint'], 200));
    Route::patch('/profile/password', fn() => response()->json(['message' => 'profile password endpoint'], 200));

    // Users (admin only)
    Route::get('/users', fn() => response()->json(['message' => 'users index endpoint'], 200));
    Route::get('/users/{id}', fn() => response()-> json(['message' => 'users show endpoint'], 200));

    // Clients
    Route::apiResource('clients', ClientController::class);

    // Activities
    Route::apiResource('activities', ActivityController::class);

    // Dashboard
    Route::get('/dashboard', fn() => response()->json(['message' => 'dashboard endpoint'], 200));
});