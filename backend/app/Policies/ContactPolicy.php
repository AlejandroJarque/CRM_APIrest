<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
    public function viewAny(User $user, Contact $contact): bool
    {
        return $user->isAdmin() || $user->id === $contact->client->user_id;
    }

    public function view(User $user, Contact $contact): bool
    {
        return $user->isAdmin() || $user->id === $contact->client->user_id;
    }

    public function create(User $user, Contact $contact): bool
    {
        return $user->isAdmin() || $user->id === $contact->client->user_id;
    }

    public function update(User $user, Contact $contact): bool
    {
        return $user->isAdmin() || $user->id === $contact->client->user_id;
    }

    public function delete(User $user, Contact $contact): bool
    {
        return $user->isAdmin() || $user->id === $contact->client->user_id;
    }
}