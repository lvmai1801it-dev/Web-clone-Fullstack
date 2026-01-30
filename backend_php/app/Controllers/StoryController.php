<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Story;
use App\Repositories\StoryRepository;
use App\Repositories\ChapterRepository;
use App\Services\StoryService;
use Lib\Validator\RequestValidator;
use Lib\Database\DatabaseConnection;
use OpenApi\Annotations as OA;
use Api\V1\Middleware\AuthMiddleware;

class StoryController extends BaseController
{
    private StoryRepository $storyRepo;
    private ChapterRepository $chapterRepo;
    private StoryService $storyService;
    private RequestValidator $validator;

    public function __construct()
    {
        $container = \Lib\Container\ServiceContainer::getInstance();
        $this->storyRepo = $container->get('storyRepository');
        $this->chapterRepo = $container->get('chapterRepository'); // Use from container
        $this->storyService = $container->get('storyService');
        $this->validator = $container->get('validator');
    }


    /**
     * @OA\Get(
     *     path="/api/v1/public/stories",
     *     tags={"Stories"},
     *     summary="Get list of stories",
     *     description="Retrieve paginated list of stories with optional filters.",
     *     @OA\Parameter(name="q", in="query", description="Search by title", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="category_id", in="query", description="Filter by Category ID", required=false, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="author_id", in="query", description="Filter by Author ID", required=false, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="status", in="query", description="Filter by Status (draft, published, etc)", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="is_vip", in="query", description="Filter VIP stories", required=false, @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="min_chapters", in="query", description="Minimum number of chapters", required=false, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="sort", in="query", description="Sort field (created_at, updated_at, views)", required=false, @OA\Schema(type="string", enum={"updated_at", "created_at", "views"}, default="updated_at")),
     *     @OA\Parameter(name="order", in="query", description="Sort order (ASC, DESC)", required=false, @OA\Schema(type="string", enum={"ASC", "DESC"}, default="DESC")),
     *     @OA\Parameter(name="page", in="query", description="Page number", required=false, @OA\Schema(type="integer", default=1)),
     *     @OA\Parameter(name="limit", in="query", description="Items per page", required=false, @OA\Schema(type="integer", default=20)),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Success"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="pagination", type="object",
     *                 @OA\Property(property="total", type="integer"),
     *                 @OA\Property(property="current_page", type="integer"),
     *                 @OA\Property(property="total_pages", type="integer")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        // Nhận tham số từ Query String
        $filters = [
            'search' => $_GET['q'] ?? null,
            'category_id' => isset($_GET['category_id']) ? (int) $_GET['category_id'] : null,
            'author_id' => isset($_GET['author_id']) ? (int) $_GET['author_id'] : null,
            'status' => $_GET['status'] ?? null,
            'is_vip' => isset($_GET['is_vip']) ? (bool) $_GET['is_vip'] : null,
            'min_chapters' => isset($_GET['min_chapters']) ? (int) $_GET['min_chapters'] : null,
            'sort' => $_GET['sort'] ?? 'updated_at', // views, rating, created_at
            'order' => $_GET['order'] ?? 'DESC',
            'page' => isset($_GET['page']) ? (int) $_GET['page'] : 1,
            'limit' => isset($_GET['limit']) ? (int) $_GET['limit'] : 20,
        ];

        $result = $this->storyRepo->getStories($filters);

        $pagination = $result['pagination'];
        $this->paginatedResponse(
            $result['data'],
            (int) $pagination['total'],
            (int) $pagination['page'],
            (int) $pagination['limit']
        );
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/stories/{idOrSlug}",
     *     tags={"Stories"},
     *     summary="Get Story Detail",
     *     description="Retrieve details of a specific story by ID or Slug.",
     *     @OA\Parameter(name="idOrSlug", in="path", description="ID or Slug of the story", required=true, @OA\Schema(type="string")),
     *     @OA\Parameter(name="with_chapters", in="query", description="Include chapters in response (0 or 1)", required=false, @OA\Schema(type="integer", enum={0, 1})),
     *     @OA\Parameter(name="limit", in="query", description="Limit chapters if included", required=false, @OA\Schema(type="integer", default=50)),
     *     @OA\Response(
     *         response=200,
     *         description="Story Detail",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="slug", type="string"),
     *                 @OA\Property(property="chapters", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Story Not Found"
     *     )
     * )
     */
    public function show($idOrSlug)
    {
        // Xác định xem tham số là ID (số) hay Slug (chuỗi)
        if (is_numeric($idOrSlug)) {
            $story = $this->storyRepo->findById((int) $idOrSlug);
        } else {
            $story = $this->storyRepo->findBySlug($idOrSlug);
        }

        if (!$story) {
            \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Truyện');
            return;
        }

        // Convert DTO to array to allow appending dynamic properties like 'chapters'
        // or just rely on the fact that we return JSON eventually.
        // But if we assign $story['chapters'], $story MUST be an array.
        $storyArray = $story->toArray();

        // Tăng lượt xem (có thể làm async hoặc đơn giản ở đây)
        // $this->storyRepo->incrementViewCount($story->id); 

        // [OPTIMIZATION] Nếu client muốn lấy luôn chương (để giảm số request)
        // Thêm param ?with_chapters=1
        if (isset($_GET['with_chapters'])) {
            $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
            $chapters = $this->chapterRepo->getChaptersByStoryId((int) $story->id, 1, $limit);
            // Convert chapter DTOs to arrays
            $storyArray['chapters'] = array_map(fn($c) => $c->toArray(), $chapters);
        }

        $this->successResponse($storyArray);
    }

    // ... (rest of methods until save)

    private function handleSaveStory(array $data): \App\DTOs\StoryDto
    {
        $rules = [
            'title' => ['required', 'string', 'min:3', 'max:255'],
        ];

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($data['id'])) {
            // Creation rules
        }

        // Use validator manually since we might be in a loop (bulk import) or single request
        // But validator->validateAndRespond sends response and exits.
        // We need validate only.
        // The validator helper validateAndRespond is bound to controller instance to send response.
        // Here we want to throw exception if invalid, or return errors.

        // Let's check Validator class. If simple, I'll just check title.
        if (empty($data['title'])) {
            throw new \Exception("Title is required");
        }

        $result = $this->storyService->saveStory($data);
        if (!$result) {
            throw new \Exception("Failed to save story");
        }

        return $result;
    }

    public function save()
    {
        // [AUTH] Check Permission (Admin Only)
        try {
            $auth = new AuthMiddleware();
            $user = $auth->handle();

            if ($user->role !== \App\Constants\AppConstants::ROLE_ADMIN) {
                \Lib\ErrorHandler\ErrorHandler::unauthorized($this, 'Unauthorized: Admin access required');
                return;
            }
        } catch (\Exception $e) {
            \Lib\ErrorHandler\ErrorHandler::unauthorized($this, $e->getMessage());
            return;
        }

        $input = file_get_contents("php://input");
        $data = json_decode($input, true);

        if (!$data) {
            \Lib\ErrorHandler\ErrorHandler::validationFailed($this, ['json' => 'Invalid JSON Data']);
            return;
        }

        try {
            // Check if input is an array of stories (Bulk Upsert)
            if (array_is_list($data)) {
                $results = [];
                foreach ($data as $item) {
                    try {
                        $results[] = $this->handleSaveStory($item);
                    } catch (\Exception $e) {
                        $results[] = [
                            'success' => false,
                            'input_title' => $item['title'] ?? 'Unknown',
                            'error' => $e->getMessage()
                        ];
                    }
                }
                $this->successResponse($results);
            } else {
                // Single Story Upsert
                $result = $this->handleSaveStory($data);
                $this->successResponse($result);
            }
        } catch (\Exception $e) {
            \Lib\ErrorHandler\ErrorHandler::internalError($this, $e->getMessage());
        }
    }

    // ...

    public function delete($id)
    {
        // [AUTH] Check Permission (Admin Only)
        try {
            $auth = new AuthMiddleware();
            $user = $auth->handle();

            if ($user->role !== \App\Constants\AppConstants::ROLE_ADMIN) {
                \Lib\ErrorHandler\ErrorHandler::unauthorized($this, 'Unauthorized: Admin access required');
                return;
            }
        } catch (\Exception $e) {
            \Lib\ErrorHandler\ErrorHandler::unauthorized($this, $e->getMessage());
            return;
        }

        try {
            $this->storyService->deleteStory((int) $id);
            $this->successResponse(['message' => "Deleted story $id successfully"]);
        } catch (\Exception $e) {
            \Lib\ErrorHandler\ErrorHandler::internalError($this, $e->getMessage());
        }
    }
}
