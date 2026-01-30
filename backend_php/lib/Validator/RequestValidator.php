<?php

declare(strict_types=1);

namespace Lib\Validator;

use App\Exceptions\ValidationException;

class RequestValidator
{
    /**
     * Validate data against rules
     * @param array $data
     * @param array $rules ['field' => ['required', 'string', 'min:3']]
     * @throws ValidationException
     */
    public function validate(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $fieldRules) {
            foreach ($fieldRules as $rule) {
                $value = $data[$field] ?? null;

                if ($rule === 'required' && empty($value)) {
                    $errors[$field][] = "Field '$field' is required.";
                    continue; // Skip other rules if empty
                }

                if ($value !== null && $rule === 'string' && !is_string($value)) {
                    $errors[$field][] = "Field '$field' must be a string.";
                }

                if ($value !== null && $rule === 'integer' && !filter_var($value, FILTER_VALIDATE_INT)) {
                    $errors[$field][] = "Field '$field' must be an integer.";
                }

                // Parse complex rules like max:255
                if (str_contains($rule, ':')) {
                    [$ruleName, $param] = explode(':', $rule);

                    if ($value !== null && $ruleName === 'max' && is_string($value) && strlen($value) > (int) $param) {
                        $errors[$field][] = "Field '$field' must not exceed $param characters.";
                    }

                    if ($value !== null && $ruleName === 'min' && is_string($value) && strlen($value) < (int) $param) {
                        $errors[$field][] = "Field '$field' must be at least $param characters.";
                    }
                }

                // Check for 'email' rule (simple rule)
                if ($value !== null && $rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[$field][] = "Field '$field' must be a valid email address.";
                }
            }
        }

        return $errors;
    }

    /**
     * Sanitize input array recursively
     */
    public function sanitize(array $data): array
    {
        $sanitized = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitize($value);
            } elseif (is_string($value)) {
                $sanitized[$key] = htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
            } else {
                $sanitized[$key] = $value;
            }
        }
        return $sanitized;
    }
    /**
     * Validate and respond with error if validation fails
     * 
     * @param array $data Data to validate
     * @param array $rules Validation rules
     * @param \App\Core\BaseController $controller Controller instance for error response
     * @return bool True if validation passed, false otherwise (error response already sent)
     */
    public function validateAndRespond(
        array $data,
        array $rules,
        \App\Core\BaseController $controller
    ): bool {
        $errors = $this->validate($data, $rules);

        if (!empty($errors)) {
            $controller->errorResponse('Dữ liệu không hợp lệ', 400, $errors);
            return false;
        }

        return true;
    }

    /**
     * Get clean data (sanitized) based on rules
     */
    public function getCleanData(array $data, array $rules = []): array
    {
        // Nếu có rules, chỉ giữ lại fields trong rules
        if (!empty($rules)) {
            $data = array_intersect_key($data, array_flip(array_keys($rules)));
        }

        return $this->sanitize($data);
    }
}
