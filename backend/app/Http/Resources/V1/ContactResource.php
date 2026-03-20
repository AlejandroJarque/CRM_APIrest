<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'client_name' => $this->client?->name,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'position' => $this->position,
            'created_at' => $this->created_at,
        ];
    }
}
