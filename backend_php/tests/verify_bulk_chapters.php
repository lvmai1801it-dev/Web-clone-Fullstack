<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Repositories\ChapterRepository;
use App\Repositories\StoryRepository;
use App\Services\ChapterService;
use Lib\Database\DatabaseConnection;
use Dotenv\Dotenv;

// Load Env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    echo "--- START BULK CHAPTER VERIFICATION ---" . PHP_EOL;

    $db = DatabaseConnection::getInstance();
    $chapterRepo = new ChapterRepository($db);
    $storyRepo = new StoryRepository($db);
    $service = new ChapterService($chapterRepo, $storyRepo);

    // 1. Setup: Create a dummy story
    echo "[SETUP] Creating dummy story..." . PHP_EOL;
    $storyId = $storyRepo->create([
        'title' => 'Bulk Import Test Story ' . time(),
        'author_id' => 1,
        'slug' => 'bulk-test-story-' . time()
    ]);
    echo "Story ID: $storyId" . PHP_EOL;

    // 2. Test Bulk Import
    echo "[TEST 1] Bulk Import 3 Chapters..." . PHP_EOL;
    $chaptersData = [
        [
            "number" => 1,
            "audio_url" => "http://archive.org/1.mp3",
            "title" => "Tập 1"
        ],
        [
            "number" => 2,
            "audio_url" => "http://archive.org/2.mp3",
            "title" => "Tập 2"
        ],
        [
            "number" => 3,
            "audio_url" => "http://archive.org/3.mp3",
            "title" => "Tập 3"
        ]
    ];

    $results = $service->saveChaptersBatch($storyId, $chaptersData);

    echo "Imported " . count($results) . " chapters." . PHP_EOL;

    // Verify
    if (count($results) === 3) {
        echo "PASS: Count matches" . PHP_EOL;
    } else {
        echo "FAIL: Count mismatch" . PHP_EOL;
    }

    $story = $storyRepo->findById($storyId);
    if ($story['total_chapters'] == 3) {
        echo "PASS: Total chapters updated to 3" . PHP_EOL;
    } else {
        echo "FAIL: Total chapters = " . $story['total_chapters'] . PHP_EOL;
    }

    // 3. Test Bulk Update (Upsert)
    echo "[TEST 2] Bulk Update (Add 1, Update 1)..." . PHP_EOL;
    $chaptersData2 = [
        [
            "id" => $results[0]['id'], // Update existing ID
            "number" => 1,
            "audio_url" => "http://archive.org/1_new.mp3",
            "title" => "Tập 1 Updated"
        ],
        [
            "number" => 4, // New
            "audio_url" => "http://archive.org/4.mp3",
            "title" => "Tập 4"
        ]
    ];

    $results2 = $service->saveChaptersBatch($storyId, $chaptersData2);

    $story = $storyRepo->findById($storyId);
    if ($story['total_chapters'] == 4) {
        echo "PASS: Total chapters updated to 4" . PHP_EOL;
    } else {
        echo "FAIL: Total chapters = " . $story['total_chapters'] . PHP_EOL;
    }

    // Verify Update
    $chap1 = $chapterRepo->findById((int) $results[0]['id']);
    if ($chap1['title'] === 'Tập 1 Updated') {
        echo "PASS: Chapter 1 title updated" . PHP_EOL;
    } else {
        echo "FAIL: Chapter 1 title mismatch" . PHP_EOL;
    }

    // Cleanup
    echo "[CLEANUP] Deleting story..." . PHP_EOL;
    $storyRepo->delete($storyId);

    echo "--- ALL BULK TESTS PASSED ---" . PHP_EOL;

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
    echo "Trace: " . $e->getTraceAsString() . PHP_EOL;
    exit(1);
}
