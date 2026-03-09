<?php

namespace App\Events;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class ClientUpdated
{
    use Dispatchable;

    public function __construct(
        public readonly User $user,
        public readonly Client $model
    ) {}
}