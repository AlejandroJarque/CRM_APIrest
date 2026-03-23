<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_DONE = 'done';
    public const STATUSES = [
    self::STATUS_PENDING,
    self::STATUS_IN_PROGRESS,
    self::STATUS_DONE,
    ];

    public const TYPE_CALL     = 'call';
    public const TYPE_EMAIL    = 'email';
    public const TYPE_MEETING  = 'meeting';
    public const TYPE_DEMO     = 'demo';
    public const TYPE_PROPOSAL = 'proposal';
    public const TYPES = [
        self::TYPE_CALL,
        self::TYPE_EMAIL,
        self::TYPE_MEETING,
        self::TYPE_DEMO,
        self::TYPE_PROPOSAL,
    ];

    protected $fillable = [
        'client_id',
        'contact_id',
        'user_id',
        'title',
        'type',
        'status',
        'date',
        'description',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isDone(): bool
    {
        return $this->status === self::STATUS_DONE;
    }
}
