<?php

namespace App\Application\Dashboard;

use App\Models\Activity;
use App\Models\Client;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Support\Facades\DB;

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

        $activityChart = UserActivityLog::query()
            ->where('user_id', $user->id)
            ->whereMonth('occurred_at', now()->month)
            ->whereYear('occurred_at', now()->year)
            ->select(
                DB::raw('DATE(occurred_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'date'  => $row->date,
                'count' => $row->count,
            ])
            ->values()
            ->toArray();

        return [
            'clients_count'                   => $clientsCount,
            'activities_count'                => $activitiesCount,
            'activities_completed_this_month' => $activitiesCompletedThisMonth,
            'activities_pending'              => $activitiesPending,
            'activity_chart'                  => $activityChart,
        ];
    }
}