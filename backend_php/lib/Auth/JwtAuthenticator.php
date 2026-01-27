<?php

declare(strict_types=1);

namespace Lib\Auth;

use App\Core\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User; // We will create this DTO/Model later, using generic object for now if needed, or array
use Exception;
use App\Exceptions\AuthenticationException;

class JwtAuthenticator
{
    private string $secret;
    private string $algo;
    private int $expiration;

    public function __construct()
    {
        $this->secret = Config::get('JWT_SECRET', 'secret_key');
        $this->algo = Config::get('JWT_ALGO', 'HS256');
        $this->expiration = (int) Config::get('JWT_EXPIRATION', 3600);
    }

    public function createToken(array $payload): string
    {
        $issuedAt = time();
        $tokenPayload = array_merge($payload, [
            'iat' => $issuedAt,
            'exp' => $issuedAt + $this->expiration
        ]);

        return JWT::encode($tokenPayload, $this->secret, $this->algo);
    }

    public function decodeToken(string $token): object
    {
        try {
            return JWT::decode($token, new Key($this->secret, $this->algo));
        } catch (Exception $e) {
            throw new AuthenticationException("Invalid or expired token");
        }
    }
}
