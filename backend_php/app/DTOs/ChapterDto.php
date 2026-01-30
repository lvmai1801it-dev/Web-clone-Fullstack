<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * @OA\Schema(
 *     schema="ChapterDto",
 *     title="Chapter DTO",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="story_id", type="integer"),
 *     @OA\Property(property="number", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="audio_url", type="string", nullable=true),
 *     @OA\Property(property="duration_sec", type="integer"),
 *     @OA\Property(property="created_at", type="string", format="date-time")
 * )
 */
class ChapterDto extends BaseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $story_id,
        public readonly int $number,
        public readonly string $title,
        public readonly ?string $audio_url,
        public readonly int $duration_sec,
        public readonly string $created_at
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            story_id: (int) ($data['story_id'] ?? 0),
            number: (int) ($data['number'] ?? $data['chapter_number'] ?? 0),
            title: (string) ($data['title'] ?? ''),
            audio_url: isset($data['audio_url']) ? (string) $data['audio_url'] : null,
            duration_sec: (int) ($data['duration_sec'] ?? $data['duration'] ?? 0),
            created_at: (string) ($data['created_at'] ?? '')
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'story_id' => $this->story_id,
            'number' => $this->number,
            'title' => $this->title,
            'audio_url' => $this->audio_url,
            'duration_sec' => $this->duration_sec,
            'created_at' => $this->created_at,
        ];
    }
    public static function validate(array $data): array
    {
        $errors = [];
        if (empty($data['story_id']))
            $errors['story_id'] = 'Story ID is required';
        if (empty($data['number']) && (!isset($data['number']) || $data['number'] !== 0)) {
            $errors['number'] = 'Chapter number is required';
        }
        if (empty($data['title']))
            $errors['title'] = 'Title is required';
        if (empty($data['audio_url']))
            $errors['audio_url'] = 'Audio URL is required';
        return $errors;
    }
}
