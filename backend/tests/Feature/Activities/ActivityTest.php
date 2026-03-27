<?php

namespace Tests\Feature\Activities;

use App\Models\Activity;
use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\Action;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    public function testGuestCannotAccessActivities(): void
    {
        $response = $this->getJson('/api/activities');
        $response->assertStatus(401);
    }

    public function testUserCanOnlySeeOwnActivities(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $client = Client::factory()->create(['user_id' => $user->id]);
        $otherClient = Client::factory()->create(['user_id' => $otherUser->id]);

        Activity::factory(3)->create(['client_id' => $client->id, 'user_id' => $user->id]);
        Activity::factory(2)->create(['client_id' => $otherClient->id, 'user_id' => $otherUser->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/activities');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function testAdminCanSeeAllActivities(): void
    {
        $admin = User::factory()->admin()->create();

        $client1 = Client::factory()->create();
        $client2 = Client::factory()->create();

        Activity::factory(3)->create(['client_id' => $client1->id, 'user_id' => $client1->user_id]);
        Activity::factory(2)->create(['client_id' => $client2->id, 'user_id' => $client2->user_id]);

        $response = $this->actingAs($admin, 'api')->getJson('/api/activities');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
    }

    public function testUserCanCreateActivityForOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->postJson('/api/activities', [
            'client_id' => $client->id,
            'title' => 'Follow up call',
            'status' => 'pending',
            'type' => 'call',
            'date' => now()->toDateString(),
        ]);

        $response->assertStatus(201)->assertJsonStructure(['data' => ['id', 'title', 'status', 'date', 'client_id', 'user_id'],]);

        $this->assertDatabaseHas('activities', [
            'title' => 'Follow up call',
            'user_id' => $user->id,
        ]);
    }

    public function testUserCannotCreateActivityForOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/activities', [
            'client_id' => $otherClient->id,
            'title' => 'Follow up call',
            'status' => 'pending',
            'type' => 'call',
            'date' => now()->toDateString(),
        ]);

        $response->assertStatus(403);
    }

    public function testStoreFailsWithoutTitle(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->postJson('api/activities', [
            'client_id' => $client->id,
            'status' => 'pending',
            'date' => now()->toDateString(),
        ]);

        $response->assertStatus(422);
    }

    public function testStoreFailsWithInvalidStatus(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->postJson('/api/activities', [
            'client_id' => $client->id,
            'title' => 'Follow up call',
            'status' => 'invalid_status',
            'date' => now()->toDateString(),
        ]);

        $response->assertStatus(422);
    }

    public function testUserIdIsAssignedFromClientOwner(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' =>$user->id]);

        $response = $this->actingAs($user, 'api')->postJson('/api/activities', [
            'client_id' => $client->id,
            'title' => 'Follow up call',
            'status' => 'pending',
            'type' => 'call',
            'date' => now()->toDateString(),
            'user_id' => 999,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('activities', [
            'title' => 'Follow up call',
            'user_id' => $user->id,
        ]);
    }

    public function testCompletedAtIsSetAutomaticallyWhenStatusIsDone(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->postJson('/api/activities', [
            'client_id' => $client->id,
            'title' => 'Follow up call',
            'status' => 'done',
            'type' => 'call',
            'date' => now()->toDateString(),
        ]);

        $response->assertStatus(201);

        $activity = Activity::where('title', 'Follow up call')->first();
        $this->assertNotNull($activity->completed_at);
    }

    public function testUserCanViewOwnActivity(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $activity = Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/activities/{$activity->id}");

        $response->assertStatus(200)->assertJsonStructure(['data' => ['id', 'title', 'status', 'date', 'client_id', 'user_id'],]);
    }

    public function testUserCannotViewOtherUsersActivity(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $activity = Activity::factory()->create(['client_id' => $otherClient->id, 'user_id' => $otherClient->user_id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/activities/{$activity->id}");

        $response->assertStatus(403);
    }

    public function testUserCannotUpdateOtherUsersActivity(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $activity = Activity::factory()->create(['client_id' => $otherClient->id, 'user_id' => $otherClient->user_id]);

        $response = $this->actingAs($user, 'api')->patchJson("/api/activities/{$activity->id}", [
            'title' => 'Hacked'
        ]);

        $response->assertStatus(403);
    }

    public function testCompletedAtIsSetWhenStatusUpdatedToDone(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $activity = Activity::factory()->create([
            'client_id' => $client->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $this->actingAs($user, 'api')->patchJson("/api/activities/{$activity->id}", [
            'status' => 'done',
        ]);

        $this->assertNotNull($activity->fresh()->completed_at);
    }

    public function testUserCanDeleteOwnActivity(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $activity = Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->deleteJson("api/activities/{$activity->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('activities', ['id' => $activity->id]);
    }

    public function testUserCannotDeleteOtherUsersActivity(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $activity = Activity::factory()->create(['client_id' => $otherClient->id, 'user_id' => $otherClient->user_id]);

        $response = $this->actingAs($user, 'api')->deleteJson("/api/activities/{$activity->id}");

        $response->assertStatus(403);
    }

    public function testActivitiesListIsPaginated(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        Activity::factory(20)->create(['client_id' => $client->id, 'user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/activities');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total']]);

    }

    public function testActivitiesCanBeFilteredByStatus(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory(2)->create(['client_id' => $client->id, 'user_id' => $user->id, 'status' => 'pending']);
        Activity::factory(1)->create(['client_id' => $client->id, 'user_id' => $user->id, 'status' => 'done']);

        $response = $this->actingAs($user, 'api')->getJson('/api/activities?status=pending');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function testUpcomingReturnsActivitiesInNext3Days(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory()->create([
            'client_id' => $client->id,
            'user_id'   => $user->id,
            'status'    => 'pending',
            'date'      => now()->addDay()->toDateString(),
        ]);

        Activity::factory()->create([
            'client_id' => $client->id,
            'user_id'   => $user->id,
            'status'    => 'done',
            'date'      => now()->addDay()->toDateString(),
        ]);

        Activity::factory()->create([
            'client_id' => $client->id,
            'user_id'   => $user->id,
            'status'    => 'pending',
            'date'      => now()->addDays(10)->toDateString(),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/activities/upcoming');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function testUpcomingDoesNotReturnOtherUsersActivities(): void
    {
        $user        = User::factory()->create();
        $otherClient = Client::factory()->create();

        Activity::factory()->create([
            'client_id' => $otherClient->id,
            'user_id'   => $otherClient->user_id,
            'status'    => 'pending',
            'date'      => now()->addDay()->toDateString(),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/activities/upcoming');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }
}