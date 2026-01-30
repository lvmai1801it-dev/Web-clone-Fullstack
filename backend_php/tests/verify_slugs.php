<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Repositories\StoryRepository;
use Lib\Database\DatabaseConnection;
use Dotenv\Dotenv;

// Load Env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    echo "--- START SLUG VERIFICATION ---" . PHP_EOL;

    $db = DatabaseConnection::getInstance();
    $repo = new StoryRepository($db);

    echo "[TEST] Calling StoryRepository::getAllSlugs()..." . PHP_EOL;
    $slugs = $repo->getAllSlugs();

    if (!is_array($slugs)) {
        throw new Exception("Result is not an array");
    }

    echo "Total Slugs Found: " . count($slugs) . PHP_EOL;

    if (count($slugs) > 0) {
        $firstSlug = $slugs[0];
        if (!is_string($firstSlug)) {
            throw new Exception("Slug is not a string, type: " . gettype($firstSlug));
        }
        echo "Sample Slugs:" . PHP_EOL;
        foreach (array_slice($slugs, 0, 5) as $slug) {
            echo "- " . $slug . PHP_EOL;
        }
    } else {
        echo "[WARN] No stories found in database to verify slugs." . PHP_EOL;
    }

    echo "--- VERIFICATION PASSED ---" . PHP_EOL;

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
    exit(1);
}
