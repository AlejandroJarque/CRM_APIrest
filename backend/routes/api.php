<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\MeController;
use App\Http\Controllers\Api\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\SearchController;

// Auth (public)
Route::post('/login', LoginController::class);
Route::post('/register', RegisterController::class);

// Authenticated routes
Route::middleware('auth:api')->group(function() {

    Route::get('/me', MeController::class);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);

    // Users (admin only)
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);

    // Clients
    Route::get('/clients/{client}/stats', [ClientController::class, 'stats']);
    Route::apiResource('clients', ClientController::class);

    // Activities
    Route::apiResource('activities', ActivityController::class);

    // Contacts
    Route::get('/contacts', [ContactController::class, 'indexGlobal']);
    Route::apiResource('clients.contacts', ContactController::class);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Search
    Route::get('/search', SearchController::class);
});