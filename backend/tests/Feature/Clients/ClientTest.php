<?php

namespace Tests\Feature\Clients;

use App\Models\Client;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest  extends TestCase
{
    use RefreshDatabase;

    public function testGuestCannotAccessClients(): void
    {
        $response = $this->getJSON('/api/clients');

        $response->assertStatus(401);
    }

    public function testUserCanOnlySeeOwnClients(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Client::factory(3)->create(['user_id' => $user->id]);
        Client::factory(2)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/clients');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function testAdminCanSeeAllClients(): void
    {
        
        $admin = User::factory()->admin()->create();
        Client::factory(3)->create();
        Client::factory(2)->create();

        $response = $this->actingAs($admin, 'api')->getJson('/api/clients');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
    }

    public function testUserCanCreateClient(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/clients', [
            'name' => 'Acme Corp',
            'email' => 'acme@emaple.com',
            'phone' => '123456789',
            'address' => 'Calle Mayor 1',
        ]);

        $response->assertStatus(201)->assertJsonStructure(['data' => ['id', 'name', 'email', 'phone', 'address']]);

        $this->assertDatabaseHas('clients', [
            'name' => 'Acme Corp',
            'user_id' => $user->id,
        ]);
    }

    public function testStoreFailsWithoutName(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/clients', [
            'email' => 'acme@example.com',
        ]);

        $response->assertStatus(422);
    }

    public function testStoreFailsWithInvalidEmail(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/clients', [
            'name' => 'Acme Corp',
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422);
    }

    public function testUserCanViewOwnClients(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$client->id}");

        $response->assertStatus(200)->assertJsonStructure(['data' =>['id', 'name', 'email', 'phone', 'address'],]);
    }

    public function testUserCannotViewOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();

        $response = $this->actingAs($user,'api')->getJson("/api/clients/{$otherClient->id}");

        $response->assertStatus(403);
    }

    public function testAdminCanViewAnyClient(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();

        $response = $this->actingAs($admin, 'api')->getJson("/api/clients/{$client->id}");

        $response->assertStatus(200);
    }

    public function testUserCanUpdateOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->patchJson("/api/clients/{$client->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('clients', ['name' => 'Updated Name']);
    }

    public function testUserCannotUpdateOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();

        $response = $this->actingAs($user, 'api')->patchJson("/api/clients/{$otherClient->id}", [
            'name' => 'Hacked',
        ]);

        $response->assertStatus(403);
    }

    public function testAdminCanUpdateAnyClient(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();

        $response = $this->actingAs($admin, 'api')->patchJson("/api/clients/{$client->id}", [
            'name' => 'Admin Updated',
        ]);

        $response->assertStatus(200);
    }

    public function testUserCanDeleteOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->deleteJson("/api/clients/{$client->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('clients', ['id' => $client->id]);
    }

    public function testUserCannotDeleteOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();

        $response = $this->actingAs($user, 'api')->deleteJson("/api/clients/{$otherClient->id}");

        $response->assertStatus(403);
    }

    public function testAdminCanDeleteAnyClient(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();

        $response = $this->actingAs($admin, 'api')->deleteJson("/api/clients/{$client->id}");

        $response->assertStatus(204);
    }

    public function testClientListIsPaginated(): void
    {
        $user = User::factory()->create();
        Client::factory(20)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/clients');

        $response->assertStatus(200)->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total']]);
    }

    public function testClientsCanBeFilteredByName(): void
    {
        $user = User::factory()->create();
        Client::factory()->create(['user_id' => $user->id, 'name' => 'Acme Corp']);
        Client::factory()->create(['user_id' => $user->id, 'name' => 'Other Company']);

        $response = $this->actingAs($user, 'api')->getJson('api/clients?name=Acme');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function testUserCanGetClientStats(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id, 'status' => 'done']);
        Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id, 'status' => 'done']);
        Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id, 'status' => 'pending']);

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$client->id}/stats");

        $response->assertStatus(200)->assertJsonStructure(['data' => ['total', 'completed', 'pending', 'last_activity']]);

        $this->assertEquals(3, $response->json('data.total'));
        $this->assertEquals(2, $response->json('data.completed'));
        $this->assertEquals(1, $response->json('data.pending'));
    }

    public function testUserCannotGetStatsOfOtherUsersClient(): void
    {
        $user        = User::factory()->create();
        $otherClient = Client::factory()->create();

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$otherClient->id}/stats");

        $response->assertStatus(403);
    }

    public function testStatsReturnZeroWhenNoActivities(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$client->id}/stats");

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('data.total'));
        $this->assertNull($response->json('data.last_activity'));
    }
}