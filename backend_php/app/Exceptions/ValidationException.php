<?php

declare(strict_types=1);

namespace App\Exceptions;

class ValidationException extends AppException
{
    protected int $httpStatusCode = 422;
    private array $errors;

    public function __construct(array $errors, string $message = 'Validation failed')
    {
        parent::__construct($message);
        $this->errors = $errors;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
