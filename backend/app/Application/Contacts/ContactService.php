<?php

namespace App\Application\Contacts;

use App\Events\ContactCreated;
use App\Events\ContactDeleted;
use App\Events\ContactUpdated;
use App\Models\User;
use App\Models\Client;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;

class ContactService
{
    public function listForClient(Client $client): Collection
    {
        return $client->contacts()->get();
    }

    public function listForUser(User $user): Collection
    {
        return Contact::whereHas('client', function ($query) use ($user) {
            $user->isAdmin()
                ? $query
                : $query->where('user_id', $user->id);
        })->get();
    }

    public function create(Client $client, array $data): Contact
    {
        $contact = $client->contacts()->create($data);

        ContactCreated::dispatch($client->user, $contact);

        return $contact;
    }

    public function update(Contact $contact, array $data): Contact
    {
        $contact->update($data);

        ContactUpdated::dispatch($contact->client->user, $contact);

        return $contact->fresh();
    }

    public function delete(Contact $contact): void
    {
        $user = $contact->client->user;

        $contact->delete();

        ContactDeleted::dispatch($user, $contact);
    }
}