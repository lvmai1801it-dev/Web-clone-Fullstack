<?php

declare(strict_types=1);

namespace App\DTOs;

abstract class BaseDto implements \JsonSerializable
{
    abstract public static function fromArray(array $data): self;

    abstract public function toArray(): array;

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }

    /**
     * Validate data before creating DTO
     * @param array $data
     * @return array Errors array ['field' => 'message']
     */
    public static function validate(array $data): array
    {
        return [];
    }
}
