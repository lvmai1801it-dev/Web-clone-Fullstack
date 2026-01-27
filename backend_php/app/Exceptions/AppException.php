<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class AppException extends Exception
{
    protected int $httpStatusCode = 500;

    public function getHttpStatusCode(): int
    {
        return $this->httpStatusCode;
    }
}
