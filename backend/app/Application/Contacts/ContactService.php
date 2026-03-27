<?php

namespace App\Application\Contacts;

use App\Events\ContactCreated;
use App\Events\ContactDeleted;
use App\Events\ContactUpdated;
use App\Models\User;
use App\Models\Client;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactService
{
    public function listForClient(Client $client): Collection
    {
        return $client->contacts()->get();
    }

    public function listForUser(User $user): LengthAwarePaginator
    {
        return Contact::with('client')
        ->whereHas('client', function ($query) use ($user) {
            $user->isAdmin()
                ? $query
                : $query->where('user_id', $user->id);
        })->paginate(7);
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

    public function export(User $user): StreamedResponse
    {
        $contacts = $user->isAdmin()
            ? Contact::with('client')->get()
            : Contact::with('client')
                ->whereHas('client', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->get();

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="contacts.csv"',
        ];

        $callback = function () use ($contacts) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Position', 'Client', 'Created At']);

            foreach ($contacts as $contact) {
                fputcsv($handle, [
                    $contact->id,
                    $contact->name,
                    $contact->email,
                    $contact->phone,
                    $contact->position,
                    $contact->client->name ?? '—',
                    $contact->created_at->toDateString(),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}