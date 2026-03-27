<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),
            'title'        => $this->faker->sentence(4),
            'body'         => $this->faker->paragraph(),
            'notable_type' => Client::class,
            'notable_id'   => Client::factory(),
        ];
    }
}