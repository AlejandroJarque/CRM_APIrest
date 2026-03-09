<?php

namespace App\Events;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class ContactCreated
{
    use Dispatchable;

    public function __construct(
        public readonly User $user,
        public readonly Contact $model
    ) {}
}
