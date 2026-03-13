<?php

namespace App\Listeners;

use App\Models\UserActivityLog;

class LogUserActivity
{
    public function handle(object $event): void
    {
        UserActivityLog::create([
            'user_id'     => $event->user->id,
            'action'      => $this->resolveAction($event),
            'occurred_at' => now(),
        ]);
    }

    private function resolveAction(object $event): string
    {
        return match (get_class($event)) {
            \App\Events\ClientCreated::class   => 'client.created',
            \App\Events\ClientUpdated::class   => 'client.updated',
            \App\Events\ClientDeleted::class   => 'client.deleted',
            \App\Events\ActivityCreated::class => 'activity.created',
            \App\Events\ActivityUpdated::class => 'activity.updated',
            \App\Events\ActivityDeleted::class => 'activity.deleted',
            \App\Events\ContactCreated::class  => 'contact.created',
            \App\Events\ContactUpdated::class  => 'contact.updated',
            \App\Events\ContactDeleted::class  => 'contact.deleted',
            default                            => 'unknown',
        };
    }
}