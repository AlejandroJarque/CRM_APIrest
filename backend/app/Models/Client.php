<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    public const STATUS_LEAD     = 'lead';
    public const STATUS_ACTIVE   = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_LOST     = 'lost';
    public const STATUSES = [
        self::STATUS_LEAD,
        self::STATUS_ACTIVE,
        self::STATUS_INACTIVE,
        self::STATUS_LOST,
    ];

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
}