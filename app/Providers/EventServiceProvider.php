<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        \App\Events\ClientCreated::class   => [\App\Listeners\LogUserActivity::class],
        \App\Events\ClientUpdated::class   => [\App\Listeners\LogUserActivity::class],
        \App\Events\ClientDeleted::class   => [\App\Listeners\LogUserActivity::class],
        \App\Events\ActivityCreated::class => [\App\Listeners\LogUserActivity::class],
        \App\Events\ActivityUpdated::class => [\App\Listeners\LogUserActivity::class],
        \App\Events\ActivityDeleted::class => [\App\Listeners\LogUserActivity::class],
        \App\Events\ContactCreated::class  => [\App\Listeners\LogUserActivity::class],
        \App\Events\ContactUpdated::class  => [\App\Listeners\LogUserActivity::class],
        \App\Events\ContactDeleted::class  => [\App\Listeners\LogUserActivity::class],
    ];
}