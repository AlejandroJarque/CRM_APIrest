<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function testUserCanLoginWithValidCredentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'access_token',
            'token_type',
        ]);
    }

    public function testUserCannotLoginWithInvalidCredentials()
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    public function testUserCanRegisterWithValidData(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Alejadndro',
            'email' => 'alejandro@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)->assertJsonStructure([
            'data' => ['id', 'name', 'email', 'role'],
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'alejandro@example.com',
            'role' => 'user',
        ]);
    }

    public function testRegisterFailsWithDuplicateEmail(): void
    {
        User::factory()->create(['email' => 'alejandro@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Alejandro',
            'email' => 'alejandro@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422);
    }

    public function testRegisterFailsWithWeakPassword(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Alejandro',
            'email' => 'alejandro@example.com',
            'password' => '123',
            'password_confirmation' => '123',
        ]);

        $response->assertStatus(422);
    }

    public function testRegisterIgnoresRoleInBody(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Alejandro',
            'email' => 'alejandro@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'alejandro@example.com',
            'role' => 'user',
        ]);
    }

    public function testAuthenticatedUserCanAccessMe(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/me');

        $response->assertStatus(200)->assertJsonStructure([
            'data' => ['id', 'name', 'email', 'role'],
        ]);
    }

    public function testUnauthenticatedUserCannotAccessMe(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }
}