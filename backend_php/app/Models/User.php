<?php

declare(strict_types=1);

namespace App\Models;

class User
{
    public int $id;
    public string $email;
    public string $username;
    public ?string $full_name;
    public string $role;

    // In a real strict DTO we might want a constructor to hydrate
}
