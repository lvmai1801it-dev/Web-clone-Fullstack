<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * @OA\Schema(
 *     schema="UserDto",
 *     title="User DTO",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="username", type="string"),
 *     @OA\Property(property="email", type="string"),
 *     @OA\Property(property="full_name", type="string", nullable=true),
 *     @OA\Property(property="avatar", type="string", nullable=true),
 *     @OA\Property(property="role", type="string"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="deleted_at", type="string", format="date-time", nullable=true)
 * )
 */
class UserDto implements \JsonSerializable
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $username,
        public readonly string $email,
        public readonly ?string $full_name,
        public readonly ?string $avatar,
        public readonly string $role,
        public readonly string $created_at,
        public readonly string $updated_at,
        public readonly ?string $deleted_at,
        private readonly ?string $password = null // Internal use for Auth
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            username: (string) ($data['username'] ?? ''),
            email: (string) ($data['email'] ?? ''),
            full_name: isset($data['full_name']) ? (string) $data['full_name'] : null,
            avatar: isset($data['avatar']) ? (string) $data['avatar'] : null,
            role: (string) ($data['role'] ?? 'user'),
            created_at: (string) ($data['created_at'] ?? ''),
            updated_at: (string) ($data['updated_at'] ?? ''),
            deleted_at: isset($data['deleted_at']) ? (string) $data['deleted_at'] : null,
            password: isset($data['password']) ? (string) $data['password'] : null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'full_name' => $this->full_name,
            'avatar' => $this->avatar,
            'role' => $this->role,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }

    public static function validate(array $data): array
    {
        $errors = [];
        if (empty($data['username']))
            $errors['username'] = 'Username is required';
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email is invalid';
        }
        if (empty($data['password']) && !isset($data['id'])) {
            $errors['password'] = 'Password is required for new users';
        }
        return $errors;
    }
}
