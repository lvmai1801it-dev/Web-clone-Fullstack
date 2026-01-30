<?php

declare(strict_types=1);

namespace App\DTOs;

use ArrayIterator;
use Countable;
use IteratorAggregate;
use JsonSerializable;
use Traversable;
use InvalidArgumentException;

class DtoCollection implements IteratorAggregate, Countable, JsonSerializable
{
    /** @var array<BaseDto> */
    protected array $items = [];

    public function __construct(
        protected string $dtoClass,
        array $items = []
    ) {
        foreach ($items as $item) {
            $this->add($item);
        }
    }

    public function add(mixed $item): void
    {
        if (!$item instanceof $this->dtoClass) {
            // Check if it's an array and try to convert if dtoClass has fromArray
            if (is_array($item) && method_exists($this->dtoClass, 'fromArray')) {
                $item = call_user_func([$this->dtoClass, 'fromArray'], $item);
            } else {
                throw new InvalidArgumentException("Item must be instance of {$this->dtoClass} or a valid array for fromArray");
            }
        }
        $this->items[] = $item;
    }

    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->items);
    }

    public function count(): int
    {
        return count($this->items);
    }

    public function toArray(): array
    {
        return array_map(fn($item) => $item->toArray(), $this->items);
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }

    /**
     * Get all items
     * @return array
     */
    public function all(): array
    {
        return $this->items;
    }
}
