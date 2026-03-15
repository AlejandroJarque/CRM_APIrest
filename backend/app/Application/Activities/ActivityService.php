<?php

namespace App\Application\Activities;

use App\Events\ActivityCreated;
use App\Events\ActivityDeleted;
use App\Events\ActivityUpdated;
use App\Models\Activity;
use App\Models\Client;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityService
{
    public function listFor(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = $user->isAdmin()
            ? Activity::query()
            : Activity::where('user_id', $user->id);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function createForClient(Client $client, array $data): Activity
    {
        $activity = Activity::create([
            'client_id'   => $client->id,
            'user_id'     => $client->user_id,
            'contact_id'  => $data['contact_id'] ?? null,
            'title'       => $data['title'],
            'status'      => $data['status'],
            'date'        => $data['date'],
            'description' => $data['description'] ?? null,
            'completed_at' => $data['status'] === Activity::STATUS_DONE ? now() : null,
        ]);

        ActivityCreated::dispatch($client->user, $activity);

        return $activity;
    }

    public function update(Activity $activity, array $data): Activity
    {
        if (isset($data['status']) && $data['status'] === Activity::STATUS_DONE) {
            $data['completed_at'] = now();
        }

        $activity->update($data);

        ActivityUpdated::dispatch($activity->user, $activity);

        return $activity->fresh();
    }

    public function delete(Activity $activity): void
    {
        $user = $activity->user;

        $activity->delete();

        ActivityDeleted::dispatch($user, $activity);
    }
}