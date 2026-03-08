<?php

namespace App\Application\Clients;

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

        return $query->orderBY('created_at', 'desc')->paginate(15);
    }

    public function createFor(User $user, array $data): Client
    {
        return Client::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
        ]);
    }

    public function update(Client $client, array $data): Client
    {
        $client->update($data);
        return $client->fresh();
    }

    public function delete(Client $client): void
    {
        $client->delete();
    }
}