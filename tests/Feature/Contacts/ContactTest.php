<?php

namespace Tests\Feature\Contacts;

use App\Models\Client;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function testGuestCannotAccessContacts(): void
    {
        $response = $this->getJson('/api/clients/1/contacts');
        $response->assertStatus(401);
    }

    public function testUserCanSeeContactsOfOwnClients(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        Contact::factory(3)->create(['client_id' => $client->id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$client->id}/contacts");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function testUserCannotSeeContactsOfOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        Contact::factory(2)->create(['client_id' => $otherClient->id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$otherClient->id}/contacts");

        $response->assertStatus(403);
    }

    public function testAdminCanSeeContactsOfAnyClient(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();
        Contact::factory(3)->create(['client_id' => $client->id]);

        $response = $this->actingAs($admin, 'api')->getJson("/api/clients/{$client->id}/contacts");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function testUserCanCreateContactForOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->postJson("/api/clients/{$client->id}/contacts", [
            'name' => 'Juan García',
            'email' => 'juan@acme.com',
            'phone' => '123456789',
            'position' => 'Director de compras',
        ]);

        $response->assertStatus(201)->assertJsonStructure(['data' => ['id', 'name', 'email', 'phone', 'position', 'client_id'],]);

        $this->assertDatabaseHas('contacts', [
            'name' => 'Juan García',
            'client_id' => $client->id,
        ]);
    }

    public function testUserCannotCreateContactFotOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson("/api/clients/{$otherClient->id}/contacts", [
            'name' => 'Juan Garcia',
        ]);

        $response->assertStatus(403);
    }

    public function testStoreFailsWithoutName(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->postJson("/api/clients/{$client->id}/contacts", [
            'email' => 'juan@acme.com',
        ]);

        $response->assertStatus(422);
    }

    public function testUserCanViewContactOfOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $contact = Contact::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$client->id}/contacts/{$contact->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'email', 'phone', 'position', 'client_id'],
            ]);
    }

    public function testUserCannotViewContactOfOtherUsersClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $contact = Contact::factory()->create(['client_id' => $otherClient->id]);

        $response = $this->actingAs($user, 'api')->getJson("/api/clients/{$otherClient->id}/contacts/{$contact->id}");

        $response->assertStatus(403);
    }

    public function testUserCanUpdateContactOfOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $contact = Contact::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($user, 'api')->patchJson("/api/clients/{$client->id}/contacts/{$contact->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('contacts', ['name' => 'Updated Name']);
    }

    public function testUserCannotUpdateContactOfOtherUserClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $contact = Contact::factory()->create(['client_id' => $otherClient->id]);

        $response = $this->actingAs($user, 'api')->patchJson("/api/clients/{$otherClient->id}/contacts/{$contact->id}", [
            'name' => 'Hacked',
        ]);

        $response->assertStatus(403);
    }

    public function testUserCanDeleteContactOfOwnClient(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $contact = Contact::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($user, 'api')->deleteJson("/api/clients/{$client->id}/contacts/{$contact->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);
    }

    public function testUserCannotDeleteContactOfOtherUserClient(): void
    {
        $user = User::factory()->create();
        $otherClient = Client::factory()->create();
        $contact = Contact::factory()->create(['client_id' => $otherClient->id]);

        $response = $this->actingAs($user, 'api')->deleteJson("/api/clients/{$otherClient->id}/contacts/{$contact->id}");

        $response->assertStatus(403);
    }

    public function testAdminCanDeleteContactOfAnyClient(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();
        $contact = Contact::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($admin, 'api')->deleteJson("/api/clients/{$client->id}/contacts/{$contact->id}");

        $response->assertStatus(204);
    }

}