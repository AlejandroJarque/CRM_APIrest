<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_users(): void
    {
        $response = $this->getJson('/api/users');
        $response->assertStatus(401);
    }

    public function test_user_cannot_access_users_list(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_users_list(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory(3)->create();

        $response = $this->actingAs($admin, 'api')->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'role']
                ]
            ]);
    }

    public function test_admin_can_view_single_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $response = $this->actingAs($admin, 'api')->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'email', 'role']
            ]);
    }

    public function test_user_cannot_view_single_user(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $response = $this->actingAs($user, 'api')->getJson("/api/users/{$otherUser->id}");

        $response->assertStatus(403);
    }

    public function test_users_list_is_paginated(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory(20)->create();

        $response = $this->actingAs($admin, 'api')->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total']
            ]);
    }
}