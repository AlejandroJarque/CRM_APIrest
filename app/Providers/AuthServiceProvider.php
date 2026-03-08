<?php

namespace App\Providers;

use App\Models\Activity;
use App\Models\Client;
use App\Models\User;
use App\Models\Contact;
use App\Policies\ActivityPolicy;
use App\Policies\ClientPolicy;
use App\Policies\UserPolicy;
use App\Policies\ContactPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Client::class => ClientPolicy::class,
        Activity::class => ActivityPolicy::class,
        User::class => UserPolicy::class,
        Contact::class => ContactPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}