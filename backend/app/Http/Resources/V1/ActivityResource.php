<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'user_id' => $this->user_id,
            'contact_id' => $this->contact_id,
            'title' => $this->title,
            'status' => $this->status,
            'type' => $this->type,
            'date' => $this->date,
            'description' => $this->description,
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
        ];
    }
}
