<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Client;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $q = trim($request->query('q', ''));

        if ($q === '') {
            return response()->json([
                'clients'    => [],
                'contacts'   => [],
                'activities' => [],
            ]);
        }

        $isAdmin = $request->user()->isAdmin();
        $userId  = $request->user()->id;
        $like    = "%{$q}%";

        $clients = $isAdmin
            ? Client::where('name', 'like', $like)->limit(5)->get(['id', 'name'])
            : Client::where('user_id', $userId)->where('name', 'like', $like)->limit(5)->get(['id', 'name']);

        $contacts = $isAdmin
            ? Contact::where('name', 'like', $like)->limit(5)->get(['id', 'name', 'client_id'])
            : Contact::whereHas('client', fn($q) => $q->where('user_id', $userId))
                ->where('name', 'like', $like)
                ->limit(5)
                ->get(['id', 'name', 'client_id']);

        $activities = $isAdmin
            ? Activity::where('title', 'like', $like)->limit(5)->get(['id', 'title', 'status'])
            : Activity::where('user_id', $userId)->where('title', 'like', $like)->limit(5)->get(['id', 'title', 'status']);

        return response()->json([
            'clients'    => $clients,
            'contacts'   => $contacts,
            'activities' => $activities,
        ]);
    }
}