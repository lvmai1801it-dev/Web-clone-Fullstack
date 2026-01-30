<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\StoryRepository;

class StoryService
{
    private StoryRepository $storyRepository;

    public function __construct(StoryRepository $storyRepository)
    {
        $this->storyRepository = $storyRepository;
    }

    /**
     * Create or Update a Story (Upsert)
     * 
     * @param array $data Input data
     * @return array|null The saved story data
     */
    public function saveStory(array $data): ?\App\DTOs\StoryDto
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;

        if ($id && $this->storyRepository->exists($id)) {
            // Update existing
            $this->storyRepository->update($id, $data);
            return $this->storyRepository->findById($id);
        } else {
            // Create New (Explicit ID handled inside repository if provided in $data)
            $newId = $this->storyRepository->create($data);
            return $this->storyRepository->findById($newId);
        }
    }

    /**
     * Delete a Story
     * 
     * @param int $id Story ID
     * @return bool
     */
    public function deleteStory(int $id): bool
    {
        return $this->storyRepository->delete($id);
    }
}
