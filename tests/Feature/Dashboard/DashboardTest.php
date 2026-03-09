<?php

namespace Tests\Feature\Dashboard;

use App\Models\Activity;
use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function testGuestCannotAccessDashboard(): void
    {
        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(401);
    }

    public function testDashboardReturnsCorrectStructure(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200)->assertJsonStructure([
            'clients_count',
            'activities_count',
            'activities_completed_this_month',
            'activities_pending',
        ]);
    }

    public function testUserSeesOnlyOwnClientsCount(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Client::factory(3)->create(['user_id' => $user->id]);
        Client::factory(2)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(3, $response->json('clients_count'));
    }

    public function testAdminSeesAllClientsCount(): void
    {
        $admin = User::factory()->admin()->create();

        Client::factory(3)->create();
        Client::factory(2)->create();

        $response = $this->actingAs($admin, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(5, $response->json('clients_count'));
    }

    public function testUserSeesOnlyOwnActivitiesCount(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $client = Client::factory()->create(['user_id' => $user->id]);
        $otherClient = Client::factory()->create(['user_id' => $otherUser->id]);

        Activity::factory(4)->create(['client_id' => $client->id, 'user_id' => $user->id]);
        Activity::factory(2)->create(['client_id' => $otherClient->id, 'user_id' => $otherUser->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(4, $response->json('activities_count'));
    }

    public function testActivitiesCompletedThisMonthCountsCorrectly(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(2)->create([
            'client_id' => $client->id,
            'user_id' => $user->id,
            'status' => 'done',
            'completed_at' => now(),
        ]);

        Activity::factory(1)->create([
            'client_id' => $client->id,
            'user_id' => $user->id,
            'status' => 'done',
            'completed_at' => now()->subMonths(2),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(2, $response->json('activities_completed_this_month'));
    }

    public function testActivitiesPendingCountsCorrectly(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(3)->create([
            'client_id' => $client->id,
            'user_id' => $user->id,
            'status' => 'pending',
            'completed_at' => null,
        ]);

        Activity::factory(1)->create([
            'client_id' => $client->id,
            'user_id' => $user->id,
            'status' => 'done',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(3, $response->json('activities_pending'));
    }
}