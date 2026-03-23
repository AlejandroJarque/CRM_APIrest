<?php

namespace Tests\Feature\DomainEvents;

use App\Models\Activity;
use App\Models\Client;
use App\Models\Contact;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function testLogIsCreatedWhenClientsIsCreated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api')->postJson('/api/clients', [
            'name'  => 'Acme Corp',
            'email' => 'acme@example.com',
        ]);

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'client.created',
        ]);
    }

    public function testLogIsCreatedWhenClientIsUpdated(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'api')->patchJson("/api/clients/{$client->id}", [
            'name' => 'Updated Name',
        ]);

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'client.updated',
        ]);
    }

    public function testLogIsCreatedWhenClientIsDeleted(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'api')->deleteJson("/api/clients/{$client->id}");

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'client.deleted',
        ]);
    }

    public function testLogIsCreatedWhenActivityIsCreated(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'api')->postJson('/api/activities', [
            'client_id' => $client->id,
            'title'     => 'Follow up',
            'status'    => 'pending',
            'type'      => 'call',
            'date'      => now()->toDateString(),
        ]);

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'activity.created',
        ]);
    }

    public function testLogIsCreatedWhenActivityIsUpdated(): void
    {
        $user     = User::factory()->create();
        $client   = Client::factory()->create(['user_id' => $user->id]);
        $activity = Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id]);

        $this->actingAs($user, 'api')->patchJson("/api/activities/{$activity->id}", [
            'title' => 'Updated title',
        ]);

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'activity.updated',
        ]);
    }

    public function testLogIsCreatedWhenActivityIsDeleted(): void
    {
        $user     = User::factory()->create();
        $client   = Client::factory()->create(['user_id' => $user->id]);
        $activity = Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id]);

        $this->actingAs($user, 'api')->deleteJson("/api/activities/{$activity->id}");

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'activity.deleted',
        ]);
    }

    public function testLogIsCreatedWhenContactIsCreated(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'api')->postJson("/api/clients/{$client->id}/contacts", [
            'name' => 'Juan García',
        ]);

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'contact.created',
        ]);
    }

    public function testLogIsCreatedWhenContactIsUpdated(): void
    {
        $user    = User::factory()->create();
        $client  = Client::factory()->create(['user_id' => $user->id]);
        $contact = Contact::factory()->create(['client_id' => $client->id]);

        $this->actingAs($user, 'api')->patchJson("/api/clients/{$client->id}/contacts/{$contact->id}", [
            'name' => 'Updated Name',
        ]);

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'contact.updated',
        ]);
    }

    public function testLogIsCreatedWhenContactIsDeleted(): void
    {
        $user    = User::factory()->create();
        $client  = Client::factory()->create(['user_id' => $user->id]);
        $contact = Contact::factory()->create(['client_id' => $client->id]);

        $this->actingAs($user, 'api')->deleteJson("/api/clients/{$client->id}/contacts/{$contact->id}");

        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $user->id,
            'action'  => 'contact.deleted',
        ]);
    }

    public function testDashboardReturnsActivityChart(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        Activity::factory()->create([
            'client_id'    => $client->id,
            'user_id'      => $user->id,
            'status'       => 'done',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user, 'api')->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'activity_chart' => [
                    '*' => ['month', 'count']
                ]
            ]);
    }
}