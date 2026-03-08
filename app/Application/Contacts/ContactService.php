<?php

namespace App\Application\Contacts;

use App\Models\Client;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;

class ContactService
{
    public function listForClient(Client $client): Collection
    {
        return $client->contacts()->get();
    }

    public function create(Client $client, array $data): Contact
    {
        return $client->contacts()->create($data);
    }

    public function update(Contact $contact, array $data): Contact
    {
        $contact->update($data);
        return $contact->fresh();
    }

    public function delete(Contact $contact): void
    {
        $contact->delete();
    }
}