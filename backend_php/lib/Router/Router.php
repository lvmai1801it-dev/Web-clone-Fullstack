<?php

declare(strict_types=1);

namespace Lib\Router;

use App\Exceptions\NotFoundException;

class Router
{
    private array $routes = [];

    public function add(string $method, string $path, array $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch(string $method, string $uri)
    {
        // Remove query string
        $uri = parse_url($uri, PHP_URL_PATH);
        $method = strtoupper($method);

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            // Convert route path to regex: /users/{id} -> #^/users/([^/]+)$#
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $route['path']);
            $pattern = "#^" . $pattern . "$#";

            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches); // Remove full match

                [$controller, $action] = $route['handler'];

                // Instantiate Controller and call Action
                $controllerInstance = new $controller();
                return $controllerInstance->$action(...$matches);
            }
        }

        throw new NotFoundException("Route not found: $method $uri");
    }

    public function get(string $path, array $handler): void
    {
        $this->add('GET', $path, $handler);
    }
    public function post(string $path, array $handler): void
    {
        $this->add('POST', $path, $handler);
    }
    public function put(string $path, array $handler): void
    {
        $this->add('PUT', $path, $handler);
    }
    public function delete(string $path, array $handler): void
    {
        $this->add('DELETE', $path, $handler);
    }
}
