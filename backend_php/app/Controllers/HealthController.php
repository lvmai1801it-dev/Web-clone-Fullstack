<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use OpenApi\Annotations as OA;

class HealthController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/api/v1/health",
     *     tags={"System"},
     *     summary="Health Check",
     *     @OA\Response(
     *         response=200,
     *         description="System is healthy",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="status", type="string", example="healthy"),
     *                 @OA\Property(property="version", type="string", example="1.0")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $this->successResponse(['status' => 'healthy', 'version' => '1.0']);
    }
}
