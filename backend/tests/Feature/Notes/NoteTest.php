<?php

namespace Tests\Feature\Notes;

use App\Models\Activity;
use App\Models\Client;
use App\Models\Contact;
use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NoteTest extends TestCase
{
    use RefreshDatabase;

    public function testUserCanListNotesForOwnClient(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        Note::factory()->count(3)->create([
            'user_id'      => $user->id,
            'notable_type' => Client::class,
            'notable_id'   => $client->id,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/clients/{$client->id}/notes");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function testUserCanCreateNoteForOwnClient(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/clients/{$client->id}/notes", [
                'title' => 'Primera nota',
                'body'  => 'Contenido de la nota',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('notes', [
            'title'        => 'Primera nota',
            'notable_type' => Client::class,
            'notable_id'   => $client->id,
        ]);
    }

    public function testUserCannotCreateNoteForOtherUsersClient(): void
    {
        $user        = User::factory()->create();
        $otherClient = Client::factory()->create();

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/clients/{$otherClient->id}/notes", [
                'title' => 'Nota intrusa',
                'body'  => 'No debería crearse',
            ]);

        $response->assertStatus(403);
    }

    public function testUserCanUpdateOwnNote(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $note   = Note::factory()->create([
            'user_id'      => $user->id,
            'notable_type' => Client::class,
            'notable_id'   => $client->id,
        ]);

        $response = $this->actingAs($user, 'api')
            ->patchJson("/api/clients/{$client->id}/notes/{$note->id}", [
                'title' => 'Título actualizado',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('notes', ['title' => 'Título actualizado']);
    }

    public function testUserCanDeleteOwnNote(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $note   = Note::factory()->create([
            'user_id'      => $user->id,
            'notable_type' => Client::class,
            'notable_id'   => $client->id,
        ]);

        $response = $this->actingAs($user, 'api')
            ->deleteJson("/api/clients/{$client->id}/notes/{$note->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('notes', ['id' => $note->id]);
    }

    public function testUserCanCreateNoteForOwnContact(): void
    {
        $user    = User::factory()->create();
        $client  = Client::factory()->create(['user_id' => $user->id]);
        $contact = Contact::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/contacts/{$contact->id}/notes", [
                'title' => 'Nota contacto',
                'body'  => 'Contenido',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('notes', [
            'notable_type' => Contact::class,
            'notable_id'   => $contact->id,
        ]);
    }

    public function testUserCannotCreateNoteForOtherUsersContact(): void
    {
        $user         = User::factory()->create();
        $otherClient  = Client::factory()->create();
        $otherContact = Contact::factory()->create(['client_id' => $otherClient->id]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/contacts/{$otherContact->id}/notes", [
                'title' => 'Intrusa',
                'body'  => 'No debería',
            ]);

        $response->assertStatus(403);
    }

    public function testUserCanCreateNoteForOwnActivity(): void
    {
        $user     = User::factory()->create();
        $client   = Client::factory()->create(['user_id' => $user->id]);
        $activity = Activity::factory()->create([
            'client_id' => $client->id,
            'user_id'   => $user->id,
        ]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/activities/{$activity->id}/notes", [
                'title' => 'Nota actividad',
                'body'  => 'Contenido',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('notes', [
            'notable_type' => Activity::class,
            'notable_id'   => $activity->id,
        ]);
    }

    public function testStoreFailsWithoutTitle(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/clients/{$client->id}/notes", [
                'body' => 'Sin título',
            ]);

        $response->assertStatus(422);
    }

    public function testStoreFailsWithoutBody(): void
    {
        $user   = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/clients/{$client->id}/notes", [
                'title' => 'Sin body',
            ]);

        $response->assertStatus(422);
    }
}