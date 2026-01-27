<?php

declare(strict_types=1);

namespace App\Exceptions;

class AuthenticationException extends AppException
{
    protected int $httpStatusCode = 401;
}
