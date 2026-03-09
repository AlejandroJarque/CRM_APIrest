<?php

namespace Tests\Feature\Profile;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function testGhestCannotAccessProfile(): void
    {
        $response = $this->getJson('/api/profile');
        $response->assertStatus(401);
    }

    public function testUserCanViewOwnProfile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->getJson('/api/profile');

        $response->assertStatus(200)->assertJsonStructure([
            'data' => ['id', 'name', 'email', 'role'],
        ]);
    }

    public function testUserCanUpdateOwnProfile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->patchJson('/api/profile', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function testProfileUpdateFailsWithDuplicateEmail(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->actingAs($user, 'api')->patchJson('/api/profile', [
            'email' => 'taken@example.com',
        ]);

        $response->assertStatus(422);
    }

    public function testUserCanChangePassword(): void
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);

        $response = $this->actingAs($user, 'api')->patchJson('/api/profile/password', [
            'current_password' => 'oldpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);
    }

    public function testPasswordChangeFailsWithWrongCurrentPassword(): void
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);

        $response = $this->actingAs($user, 'api')->patchJson('/api/profile/password', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
    }

    public function testPasswordChangeFailsWithoutConfirmation(): void
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);

        $response = $this->actingAs($user, 'api')->patchJson('/api/profile/password', [
            'current_password' => 'oldpassword',
            'password' => 'newpassword123',
        ]);

        $response->assertStatus(422);
    }
}