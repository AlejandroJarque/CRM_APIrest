<?php

namespace App\Application\Dashboard;

use App\Models\Activity;
use App\Models\Client;
use App\Models\User;
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

        $driver = DB::connection()->getDriverName();

        $monthExpression = match($driver) {
            'sqlite'  => DB::raw("strftime('%Y-%m', completed_at) as month"),
            'pgsql'   => DB::raw("TO_CHAR(completed_at, 'YYYY-MM') as month"),
            default   => DB::raw("DATE_FORMAT(completed_at, '%Y-%m') as month"),
        };

        $activityChart = (clone $activitiesQuery)
            ->whereNotNull('completed_at')
            ->where('completed_at', '>=', now()->subMonths(5)->startOfMonth())
            ->select(
                $monthExpression,
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month' => $row->month,
                'count' => $row->count,
            ])
            ->values()
            ->toArray();

        $upcomingActivities = (clone $activitiesQuery)
            ->whereNull('completed_at')
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->limit(5)
            ->get(['id', 'title', 'date', 'status'])
            ->toArray();

        $recentActivities = (clone $activitiesQuery)
            ->whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'date', 'status'])
            ->toArray();

        return [
            'clients_count'                   => $clientsCount,
            'activities_count'                => $activitiesCount,
            'activities_completed_this_month' => $activitiesCompletedThisMonth,
            'activities_pending'              => $activitiesPending,
            'activity_chart'                  => $activityChart,
            'upcoming_activities'             => $upcomingActivities,
            'recent_activities'               => $recentActivities,
        ];
    }
}