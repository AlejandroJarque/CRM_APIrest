<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\Activity;
use App\Models\User;

class ActivityPolicy
{
    
    public function viewAny(User $user): bool
    {
        return true;
    }

    
    public function view(User $user, Activity $activity): bool
    {
        return $user->isAdmin() || $user->id === $activity->user_id;
    }

    
    public function create(User $user, Client $client): bool
    {
        return $user->isAdmin() || $user->id === $client->user_id;
    }

    
    public function update(User $user, Activity $activity): bool
    {
        return $user->isAdmin() || $user->id === $activity->user_id;
    }

    
    public function delete(User $user, Activity $activity): bool
    {
        return $user->isAdmin() || $user->id === $activity->user_id;
    }

    
    public function restore(User $user, Activity $activity): bool
    {
        return false;
    }

    
    public function forceDelete(User $user, Activity $activity): bool
    {
        return false;
    }
}
