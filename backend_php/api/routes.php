<?php

declare(strict_types=1);

use Lib\Router\Router;

return function (Router $router) {
    // Create Route Groups mapping
    $files = [
        __DIR__ . '/V1/public/routes.php',
        __DIR__ . '/V1/user/routes.php',
        __DIR__ . '/V1/admin/routes.php',
    ];

    foreach ($files as $file) {
        if (file_exists($file)) {
            $routeGroup = require $file;
            if (is_callable($routeGroup)) {
                $routeGroup($router);
            }
        }
    }
};
