<?php

declare(strict_types=1);

namespace Lib\Container;

use Lib\Database\DatabaseConnection;
use App\Repositories\UserRepository;
use App\Repositories\StoryRepository;
use App\Repositories\ChapterRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\AuthorRepository;
use App\Services\AuthService;
use App\Services\StoryService;
use App\Services\ChapterService;
use Lib\Auth\JwtAuthenticator;
use Lib\Validator\RequestValidator;

class ServiceContainer
{
    private static ?self $instance = null;
    private array $services = [];

    private function __construct()
    {
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
            self::$instance->registerDefaults();
        }
        return self::$instance;
    }

    private function registerDefaults(): void
    {
        $db = DatabaseConnection::getInstance();

        // Database & Base Services
        $this->register('db', fn() => $db);
        $this->register('validator', fn() => new RequestValidator());
        $this->register('jwt', fn() => new JwtAuthenticator());
        $this->register(\Lib\Logger\Logger::class, fn() => new \Lib\Logger\Logger());

        // Repositories
        $this->register('userRepository', fn() => new UserRepository($db));
        $this->register('storyRepository', fn() => new StoryRepository($db));
        $this->register('chapterRepository', fn() => new ChapterRepository($db));
        $this->register('categoryRepository', fn() => new CategoryRepository($db));
        $this->register('authorRepository', fn() => new AuthorRepository($db));

        // Services
        $this->register('authService', fn() => new AuthService(
            $this->get('userRepository'),
            $this->get('jwt')
        ));
        $this->register('storyService', fn() => new StoryService(
            $this->get('storyRepository')
        ));
        $this->register('chapterService', fn() => new ChapterService(
            $this->get('chapterRepository'),
            $this->get('storyRepository')
        ));
    }

    public function register(string $key, callable $factory): void
    {
        $this->services[$key] = $factory;
    }

    public function get(string $key): mixed
    {
        if (!isset($this->services[$key])) {
            throw new \RuntimeException("Service '$key' not found in container");
        }
        // If the service is a closure, invoke it to get the instance
        // Ideally we might want to store the instance if we want singletons for everything,
        // but for now the factory approach is fine (repos are cheap to instantiate if DB is singleton)
        // However, Services usually should be singletons too? 
        // Let's optimize: Cache the result if it's not cached?
        // simple implementation from guide just invokes: return $this->services[$key]();
        // This means new instance every time. For Repos/Services using singleton DB it's okay but slightly wasteful.
        // Let's follow the guide for simplicity first. 

        return $this->services[$key]();
    }

    public function has(string $key): bool
    {
        return isset($this->services[$key]);
    }
}
