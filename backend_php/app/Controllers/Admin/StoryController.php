<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\BaseController;
use App\Services\StoryService;
use App\Constants\AppConstants;
use Lib\ErrorHandler\ErrorHandler;
use OpenApi\Annotations as OA;

class StoryController extends BaseController
{
    private StoryService $storyService;

    public function __construct()
    {
        $this->storyService = \Lib\Container\ServiceContainer::getInstance()->get('storyService');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/stories/save",
     *     tags={"Admin Stories"},
     *     summary="Create or Update story (Supports Batch)",
     *     description="Save a single story or a list of stories (batch). Use 'category_ids' for categories.",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(ref="#/components/schemas/StorySaveRequest"),
     *                 @OA\Schema(type="array", @OA\Items(ref="#/components/schemas/StorySaveRequest"))
     *             }
     *         )
     *     ),
     *     @OA\Response(response=200, description="Story saved")
     * )
     */
    public function save()
    {
        $data = $this->getJsonInput();
        if (!$data) {
            ErrorHandler::validationFailed($this, ['json' => 'Invalid JSON Data']);
            return;
        }

        try {
            if (array_is_list($data)) {
                $results = [];
                foreach ($data as $item) {
                    $results[] = $this->storyService->saveStory($item);
                }
                $this->successResponse($results);
            } else {
                $result = $this->storyService->saveStory($data);
                $this->successResponse($result, 'Story saved successfully');
            }
        } catch (\Exception $e) {
            ErrorHandler::internalError($this, $e->getMessage());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/stories/{id}",
     *     tags={"Admin Stories"},
     *     summary="Delete story",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Story deleted")
     * )
     */
    public function delete($id)
    {
        try {
            $this->storyService->deleteStory((int) $id);
            $this->successResponse(null, 'Story deleted successfully');
        } catch (\Exception $e) {
            ErrorHandler::internalError($this, $e->getMessage());
        }
    }
}
