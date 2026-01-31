<?php

declare(strict_types=1);

namespace App\DTOs\Request;

use App\DTOs\BaseDto;

/**
 * @OA\Schema(
 *     schema="CategoryCreateRequest",
 *     title="Category Create Request",
 *     required={"name", "slug"},
 *     @OA\Property(property="id", type="integer", example=9, description="Optional ID for upsert"),
 *     @OA\Property(property="name", type="string", example="Action"),
 *     @OA\Property(property="slug", type="string", example="action")
 * )
 */
class CategoryCreateRequest extends BaseDto
{
    public function __construct(
        public readonly string $name,
        public readonly string $slug
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) ($data['name'] ?? ''),
            slug: (string) ($data['slug'] ?? '')
        );
    }

    public static function validate(array $data): array
    {
        $errors = [];
        if (empty($data['name'])) {
            $errors['name'] = 'Name is required';
        }
        if (empty($data['slug'])) {
            $errors['slug'] = 'Slug is required';
        }
        return $errors;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug
        ];
    }
}
