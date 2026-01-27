<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\BaseRepository;
use PDO;

class UserRepository extends BaseRepository
{
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function create(array $data): int
    {
        $sql = "INSERT INTO users (username, email, password, full_name, role) 
                VALUES (:username, :email, :password, :full_name, :role)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':username' => $data['username'],
            ':email' => $data['email'],
            ':password' => $data['password'], // Use hashed password passed from Service
            ':full_name' => $data['full_name'] ?? null,
            ':role' => $data['role'] ?? 'user'
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function exists(string $email): bool
    {
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        return (bool) $stmt->fetchColumn();
    }
}
