<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Clients\ClientService;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\V1\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClientController extends Controller
{
    
    public function __construct(private ClientService $service)
    {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $clients = $this->service->listFor(
            $request->user(),
            $request->only(['name'])
        );

        return ClientResource::collection($clients);
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $client = $this->service->createFor(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'data' => new ClientResource($client),
        ], 201);
    }

    public function show(Request $request, Client $client): JsonResponse
    {
        $this->authorize('view', $client);

        return response()->json([
            'data' => new ClientResource($client),
        ]);
    }

    public function stats(Request $request, Client $client): JsonResponse
    {
        $this->authorize('view', $client);

        $total     = $client->activities()->count();
        $completed = $client->activities()->where('status', 'done')->count();
        $pending   = $client->activities()->where('status', 'pending')->count();
        $last      = $client->activities()
                        ->whereNotNull('completed_at')
                        ->orderBy('completed_at', 'desc')
                        ->value('completed_at');

        return response()->json([
            'data' => [
                'total'         => $total,
                'completed'     => $completed,
                'pending'       => $pending,
                'last_activity' => $last ? $last->toDateString() : null,
            ],
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        $this->authorize('update', $client);

        $client = $this->service->update($client, $request->validated());

        return response()->json([
            'data' => new ClientResource($client),
        ]);
    }

    public function destroy(Request $request, Client $client): JsonResponse
    {
        $this->authorize('delete', $client);

        $this->service->delete($client);

        return response()->json(null, 204);
    }

    public function export(Request $request): StreamedResponse
    {
        return $this->service->export($request->user());
    }
}
