<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use App\Services\ChapterService;
use App\Repositories\ChapterRepository;
use App\Repositories\StoryRepository;
use Lib\Database\DatabaseConnection;
use Lib\Validator\RequestValidator;
use Api\V1\Middleware\AuthMiddleware;
use OpenApi\Annotations as OA;

class ChapterController extends BaseController
{
    private ChapterService $chapterService;
    private RequestValidator $validator;

    public function __construct()
    {
        $container = \Lib\Container\ServiceContainer::getInstance();
        $this->chapterService = $container->get('chapterService');
        $this->validator = $container->get('validator');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/chapters/save",
     *     tags={"Chapters"},
     *     summary="Create or Update Chapter",
     *     description="Admin only",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="story_id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="audio_url", type="string"),
     *             @OA\Property(property="number", type="integer"),
     *             @OA\Property(property="duration_sec", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Saved Chapter"),
     *     @OA\Response(response=403, description="Unauthorized")
     * )
     */
    public function save()
    {
        // Auth Check
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

        $data = $this->getJsonBody();

        if (isset($data['chapters']) && is_array($data['chapters'])) {
            // Bulk Mode
            $storyId = (int) $data['story_id'];
            if (!$storyId) {
                \Lib\ErrorHandler\ErrorHandler::validationFailed($this, ['story_id' => 'Required for bulk import']);
                return;
            }
            try {
                $result = $this->chapterService->saveChaptersBatch($storyId, $data['chapters']);
                $this->successResponse($result);
            } catch (\Exception $e) {
                \Lib\ErrorHandler\ErrorHandler::internalError($this, $e->getMessage());
            }
            return;
        }

        // Single ModeValidation
        $rules = [
            'story_id' => ['required', 'integer'],
            'title' => ['required', 'string'],
            'audio_url' => ['required', 'string']
        ];

        if (isset($data['id']))
            $rules['id'] = ['integer'];
        if (isset($data['number']))
            $rules['number'] = ['integer'];
        if (isset($data['duration_sec']))
            $rules['duration_sec'] = ['integer'];

        if (!$this->validator->validateAndRespond($data, $rules, $this)) {
            return;
        }

        try {
            $chapter = $this->chapterService->saveChapter($data);
            $this->successResponse($chapter);
        } catch (\Exception $e) {
            \Lib\ErrorHandler\ErrorHandler::internalError($this, $e->getMessage());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/chapters/{id}",
     *     tags={"Public Content"},
     *     summary="Get Chapter Detail by ID",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Chapter Detail")
     * )
     */
    public function show($id)
    {
        $chapter = $this->chapterService->getChapterById((int) $id);
        if (!$chapter) {
            \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Chapter');
            return;
        }
        $this->successResponse($chapter);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/stories/{slug}/chapter/{number}",
     *     tags={"Public Content"},
     *     summary="Get Chapter by Story Slug and Number",
     *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Parameter(name="number", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Chapter Detail")
     * )
     */
    public function getByStorySlugAndNumber($slug, $number)
    {
        $chapter = $this->chapterService->getChapterByStorySlugAndNumber($slug, (int) $number);
        if (!$chapter) {
            \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Chapter');
            return;
        }
        $this->successResponse($chapter);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/chapters/{id}",
     *     tags={"Chapters"},
     *     summary="Delete Chapter",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function delete($id)
    {
        // Auth Check
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
            $success = $this->chapterService->deleteChapter((int) $id);
            if ($success) {
                $this->successResponse(['message' => "Deleted chapter $id successfully"]);
            } else {
                \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Chapter');
            }
        } catch (\Exception $e) {
            \Lib\ErrorHandler\ErrorHandler::internalError($this, $e->getMessage());
        }
    }
}
