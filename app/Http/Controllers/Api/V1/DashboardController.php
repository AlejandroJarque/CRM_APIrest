<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Dashboard\DashboardService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $service)
    {}

    public function index(Request $request): JsonResponse
    {
        $stats = $this->service->getStats($request->user());

        return response()->json($stats);
    }
}