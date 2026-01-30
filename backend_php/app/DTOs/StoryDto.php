<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * @OA\Schema(
 *     schema="StoryDto",
 *     title="Story DTO",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="slug", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="cover_url", type="string", nullable=true),
 *     @OA\Property(property="narrator", type="string", nullable=true),
 *     @OA\Property(property="status", type="string"),
 *     @OA\Property(property="total_chapters", type="integer"),
 *     @OA\Property(property="views", type="integer"),
 *     @OA\Property(property="rating_avg", type="number", format="float"),
 *     @OA\Property(property="rating_count", type="integer"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="author_id", type="integer"),
 *     @OA\Property(property="author_name", type="string", nullable=true),
 *     @OA\Property(property="categories", type="array", @OA\Items(ref="#/components/schemas/CategoryDto"))
 * )
 */
class StoryDto extends BaseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $title,
        public readonly string $slug,
        public readonly ?string $description,
        public readonly ?string $cover_url,
        public readonly ?string $narrator,
        public readonly string $status,
        public readonly int $total_chapters,
        public readonly int $views,
        public readonly float $rating_avg,
        public readonly int $rating_count,
        public readonly string $created_at,
        public readonly string $updated_at,
        public readonly int $author_id,
        public readonly ?string $author_name,
        /** @var CategoryDto[] */
        public readonly array $categories
    ) {
    }

    public static function fromArray(array $data): self
    {
        $categories = [];
        if (isset($data['categories']) && is_array($data['categories'])) {
            foreach ($data['categories'] as $cat) {
                if ($cat instanceof CategoryDto) {
                    $categories[] = $cat;
                } elseif (is_array($cat)) {
                    $categories[] = CategoryDto::fromArray($cat);
                }
            }
        }

        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            title: (string) ($data['title'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            description: isset($data['description']) ? (string) $data['description'] : null,
            cover_url: isset($data['cover_url']) ? (string) $data['cover_url'] : null,
            narrator: isset($data['narrator']) ? (string) $data['narrator'] : null,
            status: (string) ($data['status'] ?? 'ongoing'),
            total_chapters: (int) ($data['total_chapters'] ?? 0),
            views: (int) ($data['views'] ?? 0),
            rating_avg: (float) ($data['rating_avg'] ?? 0.0),
            rating_count: (int) ($data['rating_count'] ?? 0),
            created_at: (string) ($data['created_at'] ?? ''),
            updated_at: (string) ($data['updated_at'] ?? ''),
            author_id: (int) ($data['author_id'] ?? 0),
            author_name: isset($data['author_name']) ? (string) $data['author_name'] : null,
            categories: $categories
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_url' => $this->cover_url,
            'narrator' => $this->narrator,
            'status' => $this->status,
            'total_chapters' => $this->total_chapters,
            'views' => $this->views,
            'rating_avg' => $this->rating_avg,
            'rating_count' => $this->rating_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'author_id' => $this->author_id,
            'author_name' => $this->author_name,
            'categories' => array_map(fn($c) => $c->toArray(), $this->categories),
        ];
    }

    public static function validate(array $data): array
    {
        $errors = [];

        if (empty($data['title'])) {
            $errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) < 3) {
            $errors['title'] = 'Title must be at least 3 characters';
        }

        if (empty($data['slug'])) {
            $errors['slug'] = 'Slug is required';
        }

        if (empty($data['author_id'])) {
            $errors['author_id'] = 'Author ID is required';
        }

        return $errors;
    }
}
