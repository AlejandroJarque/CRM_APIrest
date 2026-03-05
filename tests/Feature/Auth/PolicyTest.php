<?php

namespace Tests\Feature\Auth;

use App\Models\Activity;
use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PolicyTest extends TestCase
{
    use RefreshDatabase;

    public function testUserCanViewOwnClients(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->can('view', $client));
    }

    public function testUserCannotViewOtherUsersClients(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();

        $this->assertFalse($user->can('view', $otherClient));
    }

    public function testAdminCanViewAnyClient(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();

        $this->assertTrue($admin->can('view', $client));
    }

    public function testUserCannotUpdateOtherUsersClient(): void
    {
        $user = User::factory()->admin()->create();
        $otherClient = Client::factory()->create();

        $this->assertTrue($user->can('update', $otherClient));
    }

    public function testAdminCanUpdateAnyClient(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();

        $this->assertTrue($admin->can('update', $client));
    }

    public function testUserCanViewActivityOfOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $activity = Activity::factory()->create(['client_id' => $client->id, 'user_id' => $user->id]);

        $this->assertTrue($user->can('view', $activity));
    }

    public function testUserCannotViewActivityOfOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $activity = Activity::factory()->create(['client_id' => $otherClient->id, 'user_id' => $otherClient->user_id]);

        $this->assertFalse($user->can('view', $activity));
    }

    public function testAdminCanViewAnyActivity(): void
    {
        $admin = User::factory()->admin()->create();
        $activity = Activity::factory()->create();

        $this->assertTrue($admin->can('view', $activity));
    }

    public function testUserCannotDeleteActivityOfOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $activity = Activity::factory()->create(['client_id' => $otherClient->id, 'user_id' => $otherClient->user_id]);

        $this->assertFalse($user->can('delete', $activity));
    }

    public function testAdminCanDeleteAnyActivity(): void
    {
        $admin = User::factory()->admin()->create();
        $activity = Activity::factory()->create();

        $this->assertTrue($admin->can('delete', $activity));
    }

    public function testUserCanViewAnyUser(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->assertTrue($admin->can('view', $user));
    }

    public function testUserCannotViewAnyUser(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $this->assertFalse($user->can('view', $otherUser));
    }
}