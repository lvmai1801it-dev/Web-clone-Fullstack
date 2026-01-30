<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\BaseRepository;
use PDO;

class UserRepository extends BaseRepository
{
    public function findByEmail(string $email): ?\App\DTOs\UserDto
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? \App\DTOs\UserDto::fromArray($user) : null;
    }

    public function findById(int $id): ?\App\DTOs\UserDto
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? \App\DTOs\UserDto::fromArray($user) : null;
    }

    public function create(array $data): int
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;

        if ($id) {
            $sql = "INSERT INTO users (id, username, email, password, full_name, avatar, role, created_at, updated_at) 
                    VALUES (:id, :username, :email, :password, :full_name, :avatar, :role, NOW(), NOW())";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':username' => $data['username'],
                ':email' => $data['email'],
                ':password' => $data['password'],
                ':full_name' => $data['full_name'] ?? null,
                ':avatar' => $data['avatar'] ?? null,
                ':role' => $data['role'] ?? \App\Constants\AppConstants::ROLE_USER
            ]);
            return $id;
        }

        $sql = "INSERT INTO users (username, email, password, full_name, avatar, role, created_at, updated_at) 
                VALUES (:username, :email, :password, :full_name, :avatar, :role, NOW(), NOW())";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':username' => $data['username'],
            ':email' => $data['email'],
            ':password' => $data['password'],
            ':full_name' => $data['full_name'] ?? null,
            ':avatar' => $data['avatar'] ?? null,
            ':role' => $data['role'] ?? \App\Constants\AppConstants::ROLE_USER
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        $allowedFields = ['username', 'email', 'full_name', 'avatar', 'role', 'password'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields))
            return false;

        $fields[] = "updated_at = NOW()";
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
        return $this->db->prepare($sql)->execute($params);
    }

    public function delete(int $id): bool
    {
        $sql = "UPDATE users SET deleted_at = NOW() WHERE id = :id";
        return $this->db->prepare($sql)->execute([':id' => $id]);
    }

    public function exists(string $email): bool
    {
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        return (bool) $stmt->fetchColumn();
    }
}
