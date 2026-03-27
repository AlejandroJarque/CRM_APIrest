<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Notes\NoteService;
use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Client;
use App\Models\Contact;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function __construct(private NoteService $service)
    {}

    public function indexGlobal(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Note::class);

        $notes = $this->service->listAll($request->user());

        return response()->json(['data' => $notes]);
    }

    public function storeGlobal(Request $request): JsonResponse
    {
        $this->authorize('create', Note::class);

        $request->validate([
            'title'        => 'required|string|max:255',
            'body'         => 'required|string',
            'notable_type' => 'nullable|in:clients,contacts,activities',
            'notable_id'   => 'nullable|integer',
        ]);

        $notable = null;

        if ($request->filled('notable_type') && $request->filled('notable_id')) {
            $notable = $this->resolveNotable($request->notable_type, $request->notable_id);
            $this->authorize('view', $notable);
        }

        $note = $this->service->createStandalone($request->user(), $request->only(['title', 'body']), $notable);

        return response()->json(['data' => $note], 201);
    }

    public function index(Request $request, string $notableType, int $notableId): JsonResponse
    {
        $notable = $this->resolveNotable($notableType, $notableId);
        $this->authorize('view', $notable);

        $notes = $this->service->listFor($notable);

        return response()->json(['data' => $notes]);
    }

    public function store(Request $request, string $notableType, int $notableId): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $notable = $this->resolveNotable($notableType, $notableId);
        $this->authorize('view', $notable);

        $note = $this->service->create($request->user(), $notable, $request->only(['title', 'body']));

        return response()->json(['data' => $note], 201);
    }

    public function update(Request $request, string $notableType, int $notableId, Note $note): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'body'  => 'sometimes|string',
        ]);

        $notable = $this->resolveNotable($notableType, $notableId);
        $this->authorize('view', $notable);
        $this->authorizeNote($note, $notable);

        $note = $this->service->update($note, $request->only(['title', 'body']));

        return response()->json(['data' => $note]);
    }

    public function destroy(Request $request, string $notableType, int $notableId, Note $note): JsonResponse
    {
        $notable = $this->resolveNotable($notableType, $notableId);
        $this->authorize('view', $notable);
        $this->authorizeNote($note, $notable);

        $this->service->delete($note);

        return response()->json(null, 204);
    }

    private function resolveNotable(string $type, int $id): Client|Contact|Activity
    {
        return match($type) {
            'clients'    => Client::findOrFail($id),
            'contacts'   => Contact::findOrFail($id),
            'activities' => Activity::findOrFail($id),
            default      => abort(404),
        };
    }

    private function authorizeNote(Note $note, Client|Contact|Activity $notable): void
    {
        if ($note->notable_type !== get_class($notable) || $note->notable_id !== $notable->id) {
            abort(404);
        }
    }
}