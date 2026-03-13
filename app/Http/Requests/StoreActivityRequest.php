<?php

namespace App\Http\Requests;

use App\Models\Activity;
use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'contact_id' => ['nullable', 'exists:contacts,id'],
            'title' => ['required', 'string', 'min:1'],
            'status' => ['required', 'in:' . implode(',', Activity::STATUSES)],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
        ];
    }
}
