<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Client;
use App\Models\User;

class ClientFactory extends Factory
{
    
    protected $model = Client::class;
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->company(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'status'  => fake()->randomElement(Client::STATUSES),
        ];
    }
}
