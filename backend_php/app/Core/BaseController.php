<?php

declare(strict_types=1);

namespace App\Core;

class BaseController
{
    protected function jsonResponse(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
        } catch (\JsonException $e) {
            // Fallback for valid internal error in case of encoding failure
            echo json_encode([
                'success' => false,
                'message' => 'JSON Encoding Error: ' . $e->getMessage()
            ]);
            http_response_code(500);
        }
        exit;
    }

    public function successResponse(mixed $data = null, string $message = 'Success', int $statusCode = 200): void
    {
        $this->jsonResponse([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => time()
        ], $statusCode);
    }

    public function errorResponse(string $message, int $statusCode = 400, ?array $errors = null): void
    {
        $response = [
            'success' => false,
            'message' => $message,
            'timestamp' => time()
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        $this->jsonResponse($response, $statusCode);
    }

    protected function paginatedResponse(array $items, int $total, int $page, int $perPage): void
    {
        $totalPages = (int) ceil($total / $perPage);

        $this->successResponse([
            'items' => $items,
            'pagination' => [
                'total' => $total,
                'count' => count($items),
                'per_page' => $perPage,
                'current_page' => $page,
                'total_pages' => $totalPages,
                'has_more' => $page < $totalPages
            ]
        ]);
    }

    // Helper to get request body
    protected function getJsonInput(): array
    {
        $content = file_get_contents('php://input');
        if (empty($content)) {
            return [];
        }

        try {
            $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
            return is_array($data) ? $data : [];
        } catch (\JsonException $e) {
            $this->errorResponse('Invalid JSON format', 400);
            return [];
        }
    }
}
