<?php

namespace App\Events;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class ActivityDeleted
{
    use Dispatchable;

    public function __construct(
        public readonly User $user,
        public readonly Activity $model
    ) {}
}
