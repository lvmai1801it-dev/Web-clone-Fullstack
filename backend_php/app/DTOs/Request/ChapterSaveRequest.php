<?php

declare(strict_types=1);

namespace App\DTOs\Request;

use App\DTOs\BaseDto;

/**
 * @OA\Schema(
 *     schema="ChapterSaveRequest",
 *     title="Chapter Save Request",
 *     required={"story_id", "title", "audio_url"},
 *     @OA\Property(property="id", type="integer", example=456, description="Optional ID for updating"),
 *     @OA\Property(property="story_id", type="integer", example=123, description="ID of the story this chapter belongs to"),
 *     @OA\Property(property="number", type="integer", example=1, description="Chapter number. If omitted, will be auto-incremented based on story."),
 *     @OA\Property(property="title", type="string", example="Chương 1: Khởi đầu mới"),
 *     @OA\Property(property="audio_url", type="string", example="https://example.com/audio/chapter1.mp3"),
 *     @OA\Property(property="duration_sec", type="integer", example=1200, description="Duration in seconds")
 * )
 */
class ChapterSaveRequest extends BaseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $story_id,
        public readonly ?int $number,
        public readonly string $title,
        public readonly string $audio_url,
        public readonly int $duration_sec = 0
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            story_id: (int) ($data['story_id'] ?? 0),
            number: isset($data['number']) ? (int) $data['number'] : null,
            title: (string) ($data['title'] ?? ''),
            audio_url: (string) ($data['audio_url'] ?? ''),
            duration_sec: (int) ($data['duration_sec'] ?? 0)
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
            'duration_sec' => $this->duration_sec
        ];
    }
}
