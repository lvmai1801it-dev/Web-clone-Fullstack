<?php

declare(strict_types=1);

namespace App\DTOs\Request;

use App\DTOs\BaseDto;

/**
 * @OA\Schema(
 *     schema="StorySaveRequest",
 *     title="Story Save Request",
 *     required={"title", "slug", "author_id"},
 *     @OA\Property(property="id", type="integer", example=123, description="Optional ID for updating"),
 *     @OA\Property(property="title", type="string", example="Lão Bà Ly Hôn Sau Ta Phải Không Gian Truyền Thừa"),
 *     @OA\Property(property="slug", type="string", example="lao-ba-ly-hon-sau-ta-phai-khong-gian-truyen-thua"),
 *     @OA\Property(property="author_id", type="integer", example=11667),
 *     @OA\Property(property="status", type="string", enum={"ongoing", "completed"}, example="completed"),
 *     @OA\Property(property="category_ids", type="array", @OA\Items(type="integer"), example={9, 10, 11}, description="List of category IDs"),
 *     @OA\Property(property="description", type="string", example="Description here..."),
 *     @OA\Property(property="cover_url", type="string", example="https://example.com/cover.png"),
 *     @OA\Property(property="narrator", type="string", example="Narrator Name"),
 *     @OA\Property(property="views", type="integer", example=100),
 *     @OA\Property(property="rating_avg", type="number", format="float", example=4.5),
 *     @OA\Property(property="rating_count", type="integer", example=50)
 * )
 */
class StorySaveRequest extends BaseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $title,
        public readonly string $slug,
        public readonly int $author_id,
        public readonly string $status = 'ongoing',
        public readonly array $category_ids = [],
        public readonly ?string $description = null,
        public readonly ?string $cover_url = null,
        public readonly ?string $narrator = null,
        public readonly int $views = 0,
        public readonly float $rating_avg = 0.0,
        public readonly int $rating_count = 0
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            title: (string) ($data['title'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            author_id: (int) ($data['author_id'] ?? 0),
            status: (string) ($data['status'] ?? 'ongoing'),
            category_ids: (array) ($data['category_ids'] ?? []),
            description: isset($data['description']) ? (string) $data['description'] : null,
            cover_url: isset($data['cover_url']) ? (string) $data['cover_url'] : null,
            narrator: isset($data['narrator']) ? (string) $data['narrator'] : null,
            views: (int) ($data['views'] ?? 0),
            rating_avg: (float) ($data['rating_avg'] ?? 0.0),
            rating_count: (int) ($data['rating_count'] ?? 0)
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'author_id' => $this->author_id,
            'status' => $this->status,
            'category_ids' => $this->category_ids,
            'description' => $this->description,
            'cover_url' => $this->cover_url,
            'narrator' => $this->narrator,
            'views' => $this->views,
            'rating_avg' => $this->rating_avg,
            'rating_count' => $this->rating_count
        ];
    }
}
