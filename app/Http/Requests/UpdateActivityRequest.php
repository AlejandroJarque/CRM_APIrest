<?php

namespace App\Http\Requests;

use App\Models\Activity;
use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'min:1'],
            'status' => ['sometimes', 'in:' . implode(',', Activity::STATUSES)],
            'date' => ['sometimes', 'date'],
            'description' => ['nullable', 'string'],
        ];
    }
}
