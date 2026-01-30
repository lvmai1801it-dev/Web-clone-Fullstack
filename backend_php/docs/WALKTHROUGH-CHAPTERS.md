# Walkthrough - Implement Chapter CRUD API

I have successfully implemented the API endpoints to manage chapters (Create, Update, Delete). This includes automatic recalculation of the `total_chapters` field in the Story.

## 1. Changes Overview

### Backend (`backend_php`)

#### **Repository** (`app/Repositories/ChapterRepository.php`)
- Added `create()`, `update()`, `delete()`, `findById()`.
- Added `getLastChapterNumber($storyId)` helper.
- Added `countByStoryId($storyId)` (already existed).

#### **Service** (`app/Services/ChapterService.php`) - **NEW**
- **`saveChapter($data)`**:
    - Handles logic for both Create and Update.
    - Auto-assigns `number` if not provided (max + 1).
    - Triggers `updateStoryTotalChapters()` after save.
- **`deleteChapter($id)`**:
    - Deletes chapter.
    - Triggers `updateStoryTotalChapters()` after delete.
- **`updateStoryTotalChapters($storyId)`**:
    - Counts chapters in DB.
    - Updates `stories.total_chapters`.

#### **Controller** (`app/Controllers/ChapterController.php`) - **NEW**
- **`save()`**: Validate input, call Service. Requires Admin.
- **`delete($id)`**: Call Service. Requires Admin.

#### **Routes** (`api/routes.php`)
- `POST /api/v1/chapters/save`
- `DELETE /api/v1/chapters/{id}`

## 2. API Usage

### Create Chapter
**POST** `/api/v1/chapters/save`
**Headers**: `Authorization: Bearer <token>`
**Body**:
```json
{
    "story_id": 1,
    "title": "Chapter 1: The Beginning",
    "audio_url": "https://example.com/audio.mp3",
    "number": 1, 
    "duration_sec": 300
}
```

### Update Chapter
**POST** `/api/v1/chapters/save`
**Body**:
```json
{
    "id": 10,
    "story_id": 1,
    "title": "Chapter 1: Updated Title"
}
```

### Bulk Import (New)
**POST** `/api/v1/chapters/save`
**Body**:
```json
{
  "story_id": 33,
  "chapters": [
    {
      "number": 1,
      "audio_url": "http://archive.org/1.mp3",
      "title": "Tập 1"
    },
    {
      "number": 2,
      "audio_url": "http://archive.org/2.mp3",
      "title": "Tập 2"
    }
  ]
}
```

### Delete Chapter
**DELETE** `/api/v1/chapters/10`

## 3. Verification
I have created a test script `tests/verify_chapter_crud.php` to verify the logic (especially the total_chapters sync).

Run it with PHP:
```bash
php backend_php/tests/verify_chapter_crud.php
```
*Expected Output:*
```
[TEST 1] Create Chapter 1... PASS
[TEST 2] Create Chapter 2... PASS
[TEST 3] Update Chapter 1... PASS
[TEST 4] Delete Chapter 2... PASS
--- ALL CHAPTER TESTS PASSED ---
```
