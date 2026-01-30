<?php

declare(strict_types=1);

namespace App\DTOs\Response;

use App\DTOs\BaseDto;

class PaginatedResponse extends BaseDto
{
    public function __construct(
        public readonly array $items,
        public readonly int $total,
        public readonly int $page,
        public readonly int $per_page,
        public readonly int $last_page
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            items: $data['items'] ?? [],
            total: (int) ($data['total'] ?? 0),
            page: (int) ($data['page'] ?? 1),
            per_page: (int) ($data['per_page'] ?? 20),
            last_page: (int) ($data['last_page'] ?? 1)
        );
    }

    public function toArray(): array
    {
        return [
            'items' => array_map(function ($item) {
                return $item instanceof BaseDto ? $item->toArray() : $item;
            }, $this->items),
            'pagination' => [
                'total' => $this->total,
                'page' => $this->page,
                'per_page' => $this->per_page,
                'last_page' => $this->last_page
            ]
        ];
    }
}
