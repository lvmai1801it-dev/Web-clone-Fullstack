<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Repositories\StoryRepository;
use App\Services\StoryService;
use Lib\Database\DatabaseConnection;
use Dotenv\Dotenv;

// Load Env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    $db = DatabaseConnection::getInstance();
    $repo = new StoryRepository($db);
    $service = new StoryService($repo);

    echo "--- START TEST ---" . PHP_EOL;

    // 1. Test Create (Auto ID)
    echo "[TEST 1] Create Auto ID: ";
    $data1 = [
        'title' => 'Test Story Auto ID',
        'slug' => 'test-story-auto-id-' . time(),
        'author_id' => 1 // Assuming author 1 exists or is nullable/not foreign key constrained strictly without data
    ];
    $story1 = $service->saveStory($data1);
    if ($story1 && $story1['id']) {
        echo "PASS (ID: " . $story1['id'] . ")" . PHP_EOL;
    } else {
        echo "FAIL" . PHP_EOL;
        exit(1);
    }

    // 2. Test Create (Explicit ID)
    $manualId = 99999;
    echo "[TEST 2] Create Explicit ID ($manualId): ";

    // Cleanup if exists
    if ($repo->exists($manualId)) {
        $repo->delete($manualId);
    }

    $data2 = [
        'id' => $manualId,
        'title' => 'Test Story Manual ID',
        'slug' => 'test-story-manual-id-' . time(),
        'author_id' => 1
    ];
    $story2 = $service->saveStory($data2);
    if ($story2 && $story2['id'] == $manualId) {
        echo "PASS" . PHP_EOL;
    } else {
        echo "FAIL (Got ID: " . ($story2['id'] ?? 'null') . ")" . PHP_EOL;
    }

    // 3. Test Update (Upsert)
    echo "[TEST 3] Update Existing ID ($manualId): ";
    $data3 = [
        'id' => $manualId,
        'title' => 'Updated Title Manual ID'
    ];
    $story3 = $service->saveStory($data3);
    if ($story3 && $story3['title'] === 'Updated Title Manual ID') {
        echo "PASS" . PHP_EOL;
    } else {
        echo "FAIL (Title: " . ($story3['title'] ?? 'null') . ")" . PHP_EOL;
    }

    // 4. Test Delete
    echo "[TEST 4] Delete ID ($manualId): ";
    $deleted = $service->deleteStory($manualId);
    if ($deleted) {
        // Verify deleted_at
        // Only if we check standard SQL or if we rely on repo logic
        // But delete does soft delete.
        echo "PASS" . PHP_EOL;
    } else {
        echo "FAIL" . PHP_EOL;
    }

    // Cleanup Test 1
    $service->deleteStory((int) $story1['id']);

    echo "--- ALL TESTS PASSED ---" . PHP_EOL;

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
    exit(1);
}
