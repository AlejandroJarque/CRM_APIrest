<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Contacts\ContactService;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Resources\V1\ContactResource;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContactController extends Controller
{
    public function __construct(private ContactService $service)
    {}

    public function indexGlobal(Request $request): AnonymousResourceCollection
    {
        $contacts = $this->service->listForUser($request->user());

        return ContactResource::collection($contacts);
    }

    public function index(Client $client): AnonymousResourceCollection
    {
        $this->authorize('viewAny', $client->contacts()->first() ?? new Contact(['client_id' => $client->id]));

        $contacts = $this->service->listForClient($client);

        return ContactResource::collection($contacts);
    }

    public function store(StoreContactRequest $request, Client $client): JsonResponse
    {
        $contact = new Contact(['client_id' => $client->id]);
        $this->authorize('create', $contact);

        $contact = $this->service->create($client, $request->validated());

        return response()->json(['data' => new ContactResource($contact)], 201);
    }

    public function show(Client $client, Contact $contact): JsonResponse
    {
        $this->authorize('view', $contact);

        return response()->json(['data' => new ContactResource($contact)]);
    }

    public function update(UpdateContactRequest $request, Client $client, Contact $contact): JsonResponse
    {
        $this->authorize('update', $contact);

        $contact = $this->service->update($contact, $request->validated());

        return response()->json(['data' => new ContactResource($contact)]);
    }

    public function destroy(Client $client, Contact $contact): JsonResponse
    {
        $this->authorize('delete', $contact);

        $this->service->delete($contact);

        return response()->json(null, 204);
    }
}