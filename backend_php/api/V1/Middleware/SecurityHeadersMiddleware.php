<?php

declare(strict_types=1);

namespace Api\V1\Middleware;

class SecurityHeadersMiddleware
{
    public function handle(): void
    {
        // Prevent Clickjacking
        header('X-Frame-Options: DENY');

        // Block mime-type sniffing
        header('X-Content-Type-Options: nosniff');

        // XSS Filter (Legacy but useful)
        header('X-XSS-Protection: 1; mode=block');

        // Strict Transport Security (HSTS) - 1 year
        // Only works if accessed via HTTPS, but good to have ready
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        }

        // Referrer Policy
        header('Referrer-Policy: strict-origin-when-cross-origin');

        // Content Security Policy (Basic - needs tuning for specific app needs)
        // Allowing 'unsafe-inline' and 'unsafe-eval' often needed for older JS, but strictly blocking object/base
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';");

        // Permissions Policy (Modern feature control)
        header("Permissions-Policy: geolocation=(), microphone=(), camera=()");
    }
}
