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

    public function testDashboardRequiresAuthentication(): void
    {
        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(401);
    }

    public function testDashboardReturnsExpectedStructure(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'clients_count',
                'activities_count',
                'activities_completed_this_month',
                'activities_pending',
                'activity_chart',
                'upcoming_activities',
                'recent_activities',
            ]);
    }

    public function testClientsCountReturnsOnlyOwnClients(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Client::factory(3)->create(['user_id' => $userA->id]);
        Client::factory(2)->create(['user_id' => $userB->id]);

        $response = $this->actingAs($userA, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(3, $response->json('clients_count'));
    }

    public function testAdminSeesAllClients(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Client::factory(2)->create(['user_id' => $userA->id]);
        Client::factory(3)->create(['user_id' => $userB->id]);

        $response = $this->actingAs($admin, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(5, $response->json('clients_count'));
    }

    public function testActivitiesCompletedThisMonthCountsCorrectly(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(2)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'done',
            'completed_at' => now(),
        ]);

        Activity::factory(1)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'done',
            'completed_at' => now()->subMonths(2),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(2, $response->json('activities_completed_this_month'));
    }

    public function testActivitiesPendingCountsCorrectly(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(3)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'pending',
            'completed_at' => null,
        ]);

        Activity::factory(1)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'done',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertEquals(3, $response->json('activities_pending'));
    }

    public function testActivityChartGroupsByMonth(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(3)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'done',
            'completed_at' => now(),
        ]);

        Activity::factory(2)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'done',
            'completed_at' => now()->subMonth(),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);

        $chart = $response->json('activity_chart');

        $this->assertCount(2, $chart);
        $this->assertEquals(now()->subMonth()->format('Y-m'), $chart[0]['month']);
        $this->assertEquals(2, $chart[0]['count']);
        $this->assertEquals(now()->format('Y-m'), $chart[1]['month']);
        $this->assertEquals(3, $chart[1]['count']);
    }

    public function testRecentActivitiesReturnsLastFiveCompleted(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(6)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'done',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('recent_activities'));
    }

    public function testRecentActivitiesDoesNotIncludePending(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(3)->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'pending',
            'completed_at' => null,
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('recent_activities'));
    }
}