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
                ORDER BY number ASC
                LIMIT $limit OFFSET $offset";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':story_id' => $storyId]);

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => \App\DTOs\ChapterDto::fromArray($row), $rows);
    }

    public function countByStoryId(int $storyId): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM chapters WHERE story_id = :story_id");
        $stmt->execute([':story_id' => $storyId]);
        return (int) $stmt->fetchColumn();
    }
    public function findById(int $id): ?\App\DTOs\ChapterDto
    {
        $stmt = $this->db->prepare("SELECT * FROM chapters WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? \App\DTOs\ChapterDto::fromArray($result) : null;
    }

    public function findByStoryIdAndNumber(int $storyId, int $number): ?\App\DTOs\ChapterDto
    {
        $sql = "SELECT * FROM chapters WHERE story_id = :story_id AND number = :number LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':story_id' => $storyId, ':number' => $number]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? \App\DTOs\ChapterDto::fromArray($result) : null;
    }

    public function create(array $data): int
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;

        if ($id) {
            $sql = "INSERT INTO chapters (id, story_id, title, number, audio_url, duration_sec, created_at) 
                    VALUES (:id, :story_id, :title, :number, :audio_url, :duration_sec, NOW())";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':story_id' => $data['story_id'],
                ':title' => $data['title'],
                ':number' => $data['number'],
                ':audio_url' => $data['audio_url'],
                ':duration_sec' => $data['duration_sec'] ?? 0
            ]);
            return $id;
        }

        $sql = "INSERT INTO chapters (story_id, title, number, audio_url, duration_sec, created_at) 
                VALUES (:story_id, :title, :number, :audio_url, :duration_sec, NOW())";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':story_id' => $data['story_id'],
            ':title' => $data['title'],
            ':number' => $data['number'],
            ':audio_url' => $data['audio_url'],
            ':duration_sec' => $data['duration_sec'] ?? 0
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        if (isset($data['title'])) {
            $fields[] = "title = :title";
            $params[':title'] = $data['title'];
        }
        if (isset($data['number'])) {
            $fields[] = "number = :number";
            $params[':number'] = $data['number'];
        }
        if (isset($data['audio_url'])) {
            $fields[] = "audio_url = :audio_url";
            $params[':audio_url'] = $data['audio_url'];
        }
        if (isset($data['duration_sec'])) {
            $fields[] = "duration_sec = :duration_sec";
            $params[':duration_sec'] = $data['duration_sec'];
        }

        if (empty($fields))
            return false;

        $sql = "UPDATE chapters SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM chapters WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function exists(int $id): bool
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM chapters WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function getLastChapterNumber(int $storyId): int
    {
        $stmt = $this->db->prepare("SELECT MAX(number) FROM chapters WHERE story_id = :story_id");
        $stmt->execute([':story_id' => $storyId]);
        return (int) $stmt->fetchColumn();
    }
}
