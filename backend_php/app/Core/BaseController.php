<?php

declare(strict_types=1);

namespace App\Core;

class BaseController
{
    protected function jsonResponse(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    protected function successResponse(mixed $data = null, string $message = 'Success', int $statusCode = 200): void
    {
        $this->jsonResponse([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => time()
        ], $statusCode);
    }

    protected function errorResponse(string $message, int $statusCode = 400, ?array $errors = null): void
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
    protected function getJsonBody(): array
    {
        $content = file_get_contents('php://input');
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }
}
