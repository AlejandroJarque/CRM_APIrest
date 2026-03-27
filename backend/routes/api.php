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
use App\Http\Controllers\Api\V1\NoteController;
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
    Route::get('/clients/export', [ClientController::class, 'export']);
    Route::get('/clients/{client}/stats', [ClientController::class, 'stats']);
    Route::apiResource('clients', ClientController::class);

    // Activities
    Route::get('/activities/export', [ActivityController::class, 'export']);
    Route::get('/activities/upcoming', [ActivityController::class, 'upcoming']);
    Route::apiResource('activities', ActivityController::class);

    // Contacts
    Route::get('/contacts/export', [ContactController::class, 'export']);
    Route::get('/contacts', [ContactController::class, 'indexGlobal']);
    Route::apiResource('clients.contacts', ContactController::class);

    // Notes
    Route::get('/{notableType}/{notableId}/notes', [NoteController::class, 'index']);
    Route::post('/{notableType}/{notableId}/notes', [NoteController::class, 'store']);
    Route::patch('/{notableType}/{notableId}/notes/{note}', [NoteController::class, 'update']);
    Route::delete('/{notableType}/{notableId}/notes/{note}', [NoteController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Search
    Route::get('/search', SearchController::class);
});