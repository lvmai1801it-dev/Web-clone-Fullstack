<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="Audio Stories API",
 *     version="1.0.0",
 *     description="API documentation for Audio Stories backend",
 *     @OA\Contact(
 *         email="admin@audiostories.com"
 *     )
 * )
 * @OA\Server(
 *     description="Local Development Server",
 *     url="http://localhost/backend_php"
 * )
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class SwaggerController extends BaseController
{
    public function getJson()
    {
        // Resolve absolute path to 'app' directory
        // __DIR__ is app/Controllers
        $scanPath = realpath(__DIR__ . '/../');

        // Debug: Uncomment to see what path is being scanned if JSON is still empty
        // error_log("Swagger Scanning Path: " . $scanPath);

        $openapi = \OpenApi\Generator::scan([$scanPath]);

        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        echo $openapi->toJson();
        exit;
    }
}
