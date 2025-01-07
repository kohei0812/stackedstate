<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'date',
        'title',
        'content',
        'flyer_image',
        'location_id',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
