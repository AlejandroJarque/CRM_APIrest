<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Activity;
use App\Models\Client;

class ActivityFactory extends Factory
{
    
    protected $model = Activity::class;

    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'user_id' => function (array $attributes) {
                return Client::find($attributes['client_id'])->user_id;
            },
            'title' => fake()->sentence(3),
            'status' => Activity::STATUS_PENDING,
            'date' => now()->toDateString(),
            'description' => fake()->sentence(),
        ];
    }

    public function done(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => Activity::STATUS_DONE,
            'completed_at' => now(),
        ]);
    }
}
