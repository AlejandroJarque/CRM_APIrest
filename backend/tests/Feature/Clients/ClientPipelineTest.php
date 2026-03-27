<?php

namespace Tests\Feature\Clients;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientPipelineTest extends TestCase
{
    use RefreshDatabase;

    public function testUserCanGetPipeline(): void
    {
        $user = User::factory()->create();

        Client::factory()->create(['user_id' => $user->id, 'status' => 'lead']);
        Client::factory()->create(['user_id' => $user->id, 'status' => 'lead']);
        Client::factory()->create(['user_id' => $user->id, 'status' => 'active']);
        Client::factory()->create(['user_id' => $user->id, 'status' => 'lost']);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/clients/pipeline');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['lead', 'active', 'inactive', 'lost']
            ]);

        $this->assertCount(2, $response->json('data.lead'));
        $this->assertCount(1, $response->json('data.active'));
        $this->assertCount(0, $response->json('data.inactive'));
        $this->assertCount(1, $response->json('data.lost'));
    }

    public function testUserOnlySeesOwnClientsInPipeline(): void
    {
        $user  = User::factory()->create();
        $other = User::factory()->create();

        Client::factory()->create(['user_id' => $user->id,  'status' => 'lead']);
        Client::factory()->create(['user_id' => $other->id, 'status' => 'lead']);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/clients/pipeline');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.lead'));
    }

    public function testAdminSeesAllClientsInPipeline(): void
    {
        $admin = User::factory()->admin()->create();
        $user  = User::factory()->create();

        Client::factory()->create(['user_id' => $user->id, 'status' => 'active']);
        Client::factory()->create(['user_id' => $user->id, 'status' => 'active']);

        $response = $this->actingAs($admin, 'api')
            ->getJson('/api/clients/pipeline');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data.active'));
    }

    public function testPipelineRequiresAuthentication(): void
    {
        $response = $this->getJson('/api/clients/pipeline');
        $response->assertStatus(401);
    }
}