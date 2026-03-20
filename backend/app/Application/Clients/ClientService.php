<?php

namespace App\Application\Clients;

use App\Events\ClientCreated;
use App\Events\ClientDeleted;
use App\Events\ClientUpdated;
use App\Models\Client;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class ClientService
{
    public function listFor(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = $user->isAdmin()
            ? Client::query()
            : Client::where('user_id', $user->id);

        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        return $query->orderBy('created_at', 'desc')->paginate(7);
    }

    public function createFor(User $user, array $data): Client
    {
        $client = Client::create([
            'user_id' => $user->id,
            'name'    => $data['name'],
            'email'   => $data['email'] ?? null,
            'phone'   => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        ClientCreated::dispatch($user, $client);

        return $client;
    }

    public function update(Client $client, array $data): Client
    {
        $client->update($data);

        ClientUpdated::dispatch($client->user, $client);

        return $client->fresh();
    }

    public function delete(Client $client): void
    {
        $user = $client->user;

        $client->delete();

        ClientDeleted::dispatch($user, $client);
    }
}