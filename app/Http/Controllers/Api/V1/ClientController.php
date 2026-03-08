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
}
