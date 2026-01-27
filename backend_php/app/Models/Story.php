<?php

declare(strict_types=1);

namespace App\Models;

class Story
{
    public int $id;
    public string $title;
    public string $slug;
    public ?string $cover_url;
    public ?string $narrator;
    public ?string $description;
    public string $status; // 'ongoing', 'completed'
    public int $total_chapters;
    public int $views;
    public float $rating_avg;
    public int $rating_count;
    public string $created_at;
    public string $updated_at;

    // Relations
    public ?int $author_id;
    public ?string $author_name;
    public array $categories = []; // Array of strings or objects
}
