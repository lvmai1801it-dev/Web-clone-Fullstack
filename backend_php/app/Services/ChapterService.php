<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\ChapterRepository;
use App\Repositories\StoryRepository;

class ChapterService
{
    private ChapterRepository $chapterRepo;
    private StoryRepository $storyRepo;

    public function __construct(ChapterRepository $chapterRepo, StoryRepository $storyRepo)
    {
        $this->chapterRepo = $chapterRepo;
        $this->storyRepo = $storyRepo;
    }

    /**
     * Create or Update Chapter
     * Re-calculates total_chapters for the story.
     */
    public function saveChapter(array $data): ?\App\DTOs\ChapterDto
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;
        $storyId = (int) $data['story_id'];

        // If creating new, and number is not set, set it to max + 1
        if (!$id && !isset($data['number'])) {
            $max = $this->chapterRepo->getLastChapterNumber($storyId);
            $data['number'] = $max + 1;
        }

        if ($id && $this->chapterRepo->exists($id)) {
            $this->chapterRepo->update($id, $data);
            // If story_id changed (rare), we might need to update both old and new story
            // For now assume story_id doesn't change on chapter update usually
        } else {
            $id = $this->chapterRepo->create($data);
        }

        // Update Story Total Chapters
        $this->updateStoryTotalChapters($storyId);

        return $this->chapterRepo->findById($id);
    }

    // ... saveChaptersBatch (unchanged mostly, returns array of status arrays) ...

    public function deleteChapter(int $id): bool
    {
        // Get chapter first to know story_id
        $chapter = $this->chapterRepo->findById($id);
        if (!$chapter)
            return false;

        $storyId = (int) $chapter->story_id;

        $deleted = $this->chapterRepo->delete($id);
        if ($deleted) {
            $this->updateStoryTotalChapters($storyId);
        }

        return $deleted;
    }

    public function getChapterById(int $id): ?\App\DTOs\ChapterDto
    {
        return $this->chapterRepo->findById($id);
    }

    public function getChapterByStorySlugAndNumber(string $slug, int $number): ?\App\DTOs\ChapterDto
    {
        $story = $this->storyRepo->findBySlug($slug);
        if (!$story) {
            return null;
        }
        return $this->chapterRepo->findByStoryIdAndNumber((int) $story->id, $number);
    }

    private function updateStoryTotalChapters(int $storyId): void
    {
        $count = $this->chapterRepo->countByStoryId($storyId);
        $this->storyRepo->update($storyId, ['total_chapters' => $count]);
    }
}
