<?php

declare(strict_types=1);

namespace App\DTOs\Request;

use App\DTOs\BaseDto;

/**
 * @OA\Schema(
 *     schema="AuthorUpdateRequest",
 *     title="Author Update Request",
 *     @OA\Property(property="name", type="string", example="Stephen King"),
 *     @OA\Property(property="slug", type="string", example="stephen-king")
 * )
 */
class AuthorUpdateRequest extends BaseDto
{
    public function __construct(
        public readonly ?string $name = null,
        public readonly ?string $slug = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: isset($data['name']) ? (string) $data['name'] : null,
            slug: isset($data['slug']) ? (string) $data['slug'] : null
        );
    }

    public function toArray(): array
    {
        $data = [];
        if ($this->name !== null)
            $data['name'] = $this->name;
        if ($this->slug !== null)
            $data['slug'] = $this->slug;
        return $data;
    }
}
