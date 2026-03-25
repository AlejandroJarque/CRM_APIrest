<?php

namespace App\Http\Requests;

use App\Models\Client;
use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'status'  => ['sometimes', 'in:' . implode(',', Client::STATUSES)],
        ];
    }
}
