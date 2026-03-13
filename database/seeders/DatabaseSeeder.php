<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Activity;
use App\Models\Client;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    
    public function run(): void
    {

        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        User::factory(3)->create()->each(function(User $user) {
            Client::factory(3)->create(['user_id' => $user->id])->each(function(Client $client) {
               Activity::factory(3)->create([
                'client_id' => $client->id,
                'user_id' => $client->user_id,
               ]);
               Activity::factory()->done()->create([
                'client_id' => $client->id,
                'user_id' => $client->user_id,
               ]);
            });
        });
    }
}
