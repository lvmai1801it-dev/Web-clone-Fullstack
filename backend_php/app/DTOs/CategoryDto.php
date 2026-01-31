<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * @OA\Schema(
 *     schema="CategoryDto",
 *     title="Category DTO",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="slug", type="string"),
 *     @OA\Property(property="story_count", type="integer")
 * )
 */
class CategoryDto extends BaseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $slug,
        public readonly int $story_count = 0
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            name: (string) ($data['name'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            story_count: (int) ($data['story_count'] ?? 0)
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'story_count' => $this->story_count,
        ];
    }

    public static function validate(array $data): array
    {
        $errors = [];
        if (empty($data['name']))
            $errors['name'] = 'Name is required';
        if (empty($data['slug']))
            $errors['slug'] = 'Slug is required';
        return $errors;
    }
}

