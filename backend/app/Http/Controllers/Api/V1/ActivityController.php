<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Activities\ActivityService;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ActivityController extends Controller
{
    public function __construct(private ActivityService $service) 
    {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $activities = $this->service->listFor(
            $request->user(),
            $request->only(['status'])
        );

        return \App\Http\Resources\V1\ActivityResource::collection($activities);
    }

    
    public function store(StoreActivityRequest $request): JsonResponse
    {
        $client = Client::findOrFail($request->client_id);

        if (!$request->user()->isAdmin() && $request->user()->id !== $client->user_id) {
            abort(403);
        }

        $activity = $this->service->createForClient($client, $request->validated());

        return response()->json([
            'data' => new \App\Http\Resources\V1\ActivityResource($activity),
        ], 201);
    }

    
    public function show(Request $request, Activity $activity): JsonResponse
    {
        $this->authorize('view', $activity);

        return response()->json([
            'data' => new \App\Http\Resources\V1\ActivityResource($activity),
        ]);
    }

    
    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $activity = $this->service->update($activity, $request->validated());

        return response()->json([
            'data' => new \App\Http\Resources\V1\ActivityResource($activity),
        ]);
    }

    
    public function destroy(Request $request, Activity $activity): JsonResponse
    {
        $this->authorize('delete', $activity);

        $this->service->delete($activity);

        return response()->json(null, 204);
    }

    public function export(Request $request): StreamedResponse
    {
        return $this->service->export($request->user());
    }

    public function upcoming(Request $request): AnonymousResourceCollection
    {
        $activities = $this->service->upcoming($request->user());

        return \App\Http\Resources\V1\ActivityResource::collection($activities);
    }
}
