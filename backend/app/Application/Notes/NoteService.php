<?php

namespace App\Application\Notes;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class NoteService
{
    public function listFor(Model $notable): Collection
    {
        return $notable->notes()->orderBy('created_at', 'desc')->get();
    }

    public function create(User $user, Model $notable, array $data): Note
    {
        return $notable->notes()->create([
            'user_id' => $user->id,
            'title'   => $data['title'],
            'body'    => $data['body'],
        ]);
    }

    public function update(Note $note, array $data): Note
    {
        $note->update($data);
        return $note->fresh();
    }

    public function delete(Note $note): void
    {
        $note->delete();
    }
}