<?php

declare(strict_types=1);

namespace App\Middleware;

use Lib\Auth\JwtAuthenticator;
use App\Exceptions\AuthenticationException;

class AuthMiddleware
{
    public function handle(): object
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            throw new AuthenticationException("No token provided");
        }

        $token = $matches[1];
        $authenticator = new JwtAuthenticator();

        $decoded = $authenticator->decodeToken($token);

        // Make user data avail globally for context if needed, or return it
        $_REQUEST['user'] = (array) $decoded;

        return $decoded;
    }
}
