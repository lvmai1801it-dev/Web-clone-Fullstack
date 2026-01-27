<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\BaseRepository;
use PDO;

class ChapterRepository extends BaseRepository
{
    public function getChaptersByStoryId(int $storyId, int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;

        // Note: Column is `number`, `duration_sec` based on provided schema
        $sql = "SELECT id, number, title, audio_url, duration_sec, created_at
                FROM chapters
                WHERE story_id = :story_id
                  AND deleted_at IS NULL
                ORDER BY number ASC
                LIMIT $limit OFFSET $offset";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':story_id' => $storyId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countByStoryId(int $storyId): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM chapters WHERE story_id = :story_id AND deleted_at IS NULL");
        $stmt->execute([':story_id' => $storyId]);
        return (int) $stmt->fetchColumn();
    }
}
