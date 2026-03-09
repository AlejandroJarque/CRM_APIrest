<?php

namespace App\Application\Dashboard;

use App\Models\Activity;
use App\Models\Client;
use App\Models\User;

class DashboardService
{
    public function getStats(User $user): array
    {
        $isAdmin = $user->isAdmin();

        $clientsCount = $isAdmin
            ? Client::count()
            : Client::where('user_id', $user->id)->count();

        $activitiesQuery = $isAdmin
            ? Activity::query()
            : Activity::where('user_id', $user->id);

        $activitiesCount = $activitiesQuery->count();

        $activitiesCompletedThisMonth = (clone $activitiesQuery)
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->count();

        $activitiesPending = (clone $activitiesQuery)
            ->whereNull('completed_at')
            ->count();

        return [
            'clients_count'                  => $clientsCount,
            'activities_count'               => $activitiesCount,
            'activities_completed_this_month' => $activitiesCompletedThisMonth,
            'activities_pending'             => $activitiesPending,
        ];
    }
}