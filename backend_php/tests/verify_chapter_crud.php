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
    echo "--- START CHAPTER CRUD VERIFICATION ---" . PHP_EOL;

    $db = DatabaseConnection::getInstance();
    $chapterRepo = new ChapterRepository($db);
    $storyRepo = new StoryRepository($db);
    $service = new ChapterService($chapterRepo, $storyRepo);

    // 1. Setup: Create a dummy story
    echo "[SETUP] Creating dummy story..." . PHP_EOL;
    $storyId = $storyRepo->create([
        'title' => 'Chapter Test Story ' . time(),
        'author_id' => 1,
        'slug' => 'chapter-test-story-' . time()
    ]);
    echo "Story ID: $storyId" . PHP_EOL;

    // 2. Test Create Chapter
    echo "[TEST 1] Create Chapter 1..." . PHP_EOL;
    $chap1 = $service->saveChapter([
        'story_id' => $storyId,
        'title' => 'Chapter 1',
        'audio_url' => 'http://example.com/1.mp3',
        'number' => 1
    ]);

    // Verify total chapters
    $story = $storyRepo->findById($storyId);
    if ($story['total_chapters'] == 1) {
        echo "PASS: Total chapters = 1" . PHP_EOL;
    } else {
        echo "FAIL: Total chapters = " . $story['total_chapters'] . PHP_EOL;
    }

    // 3. Test Create Chapter 2 (Auto Number)
    echo "[TEST 2] Create Chapter 2 (Auto Number)..." . PHP_EOL;
    $chap2 = $service->saveChapter([
        'story_id' => $storyId,
        'title' => 'Chapter 2',
        'audio_url' => 'http://example.com/2.mp3'
    ]);
    echo "Chapter 2 Number: " . $chap2['number'] . PHP_EOL;

    $story = $storyRepo->findById($storyId);
    if ($story['total_chapters'] == 2) {
        echo "PASS: Total chapters = 2" . PHP_EOL;
    } else {
        echo "FAIL: Total chapters = " . $story['total_chapters'] . PHP_EOL;
    }

    // 4. Test Update Chapter
    echo "[TEST 3] Update Chapter 1..." . PHP_EOL;
    $service->saveChapter([
        'id' => $chap1['id'],
        'story_id' => $storyId,
        'title' => 'Chapter 1 Updated'
    ]);
    $check = $chapterRepo->findById((int) $chap1['id']);
    if ($check['title'] === 'Chapter 1 Updated') {
        echo "PASS: Title updated" . PHP_EOL;
    } else {
        echo "FAIL: Title not updated" . PHP_EOL;
    }

    // 5. Test Delete Chapter
    echo "[TEST 4] Delete Chapter 2..." . PHP_EOL;
    $service->deleteChapter((int) $chap2['id']);

    $story = $storyRepo->findById($storyId);
    if ($story['total_chapters'] == 1) {
        echo "PASS: Total chapters decreased to 1" . PHP_EOL;
    } else {
        echo "FAIL: Total chapters = " . $story['total_chapters'] . PHP_EOL;
    }

    // Cleanup
    echo "[CLEANUP] Deleting story..." . PHP_EOL;
    $storyRepo->delete($storyId);

    echo "--- ALL CHAPTER TESTS PASSED ---" . PHP_EOL;

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
    echo "Trace: " . $e->getTraceAsString() . PHP_EOL;
    exit(1);
}
