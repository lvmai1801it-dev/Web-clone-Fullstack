# Walkthrough: Public APIs Implementation

This document details the implementation and verification of the missing Public APIs for the Audiobook platform.

## 1. Author Details by Slug
**Endpoint:** `GET /api/v1/public/authors/{slug}`

Fetches author details along with their most recent stories.

**Request:**
```http
GET /api/v1/public/authors/nguyen-nhat-anh
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Nguyễn Nhật Ánh",
        "slug": "nguyen-nhat-anh",
        "bio": "...",
        "stories": [
            {
                "id": 10,
                "title": "Mắt Biếc",
                "slug": "mat-biec",
                ...
            }
        ]
    }
}
```

## 2. Trending Stories
**Endpoint:** `GET /api/v1/public/trending`

Fetches stories sorted by views (descending).

**Request:**
```http
GET /api/v1/public/trending?limit=5
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 5,
            "title": "Top Viewing Story",
            "total_views": 1000,
            ...
        }
    ]
}
```

## 3. Recommended Stories
**Endpoint:** `GET /api/v1/public/recommended`

Fetches recommended stories (currently implemented as "Recent Stories" for MVP).

**Request:**
```http
GET /api/v1/public/recommended?limit=5
```

## 4. Global Search
**Endpoint:** `GET /api/v1/public/search`

Searches for stories by title.

**Request:**
```http
GET /api/v1/public/search?q=harry
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 3,
            "title": "Harry Potter",
            ...
        }
    ]
}
```

## Verification Steps
1.  **Authors**: call `/api/v1/public/authors` to get a slug, then call `/api/v1/public/authors/{slug}` to verify details.
2.  **Trending**: call `/api/v1/public/trending` and check if stories are returned.
3.  **Search**: call `/api/v1/public/search?q=test` (or usage established story title) and verify results.

## 5. Audio Player APIs
**Endpoint:** `GET /api/v1/public/chapters/{id}`
**Endpoint:** `GET /api/v1/public/stories/{slug}/chapter/{number}`

Fetches single chapter details including audio URL.

**Usage:**
```http
// By ID
GET /api/v1/public/chapters/123

// By Slug & Number
GET /api/v1/public/stories/mat-biec/chapter/1
```

## 6. Frontend Filters
**Endpoint:** `GET /api/v1/public/filters`

Returns list of available `sort`, `status`, `min_chapters`, `is_vip` options.

**Usage:**
```http
GET /api/v1/public/filters
```

## 7. Click Tracking
**Endpoint:** `POST /api/v1/public/stories/{id}/click`

Tracks user clicks on a story.

**Usage:**
```http
POST /api/v1/public/stories/123/click
```
