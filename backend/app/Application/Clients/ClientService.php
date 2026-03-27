<?php

namespace App\Application\Clients;

use App\Events\ClientCreated;
use App\Events\ClientDeleted;
use App\Events\ClientUpdated;
use App\Models\Client;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

        return $query->orderBy('created_at', 'desc')->paginate(6);
    }

    public function createFor(User $user, array $data): Client
    {
        $client = Client::create([
            'user_id' => $user->id,
            'name'    => $data['name'],
            'email'   => $data['email'] ?? null,
            'phone'   => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'status'  => $data['status'] ?? 'lead',
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

    public function export(User $user): StreamedResponse
    {
        $clients = $user->isAdmin()
            ? Client::all()
            : Client::where('user_id', $user->id)->get();

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="clients.csv"',
        ];

        $callback = function () use ($clients) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Address', 'Status', 'Created At']);

            foreach ($clients as $client) {
                fputcsv($handle, [
                    $client->id,
                    $client->name,
                    $client->email,
                    $client->phone,
                    $client->address,
                    $client->status,
                    $client->created_at->toDateString(),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function pipeline(User $user): array
    {
        $query = $user->isAdmin()
            ? Client::query()
            : Client::where('user_id', $user->id);

        $clients = $query->select(['id', 'name', 'email', 'status'])->get();

        return [
            'lead'     => $clients->where('status', 'lead')->values(),
            'active'   => $clients->where('status', 'active')->values(),
            'inactive' => $clients->where('status', 'inactive')->values(),
            'lost'     => $clients->where('status', 'lost')->values(),
        ];
    }
}