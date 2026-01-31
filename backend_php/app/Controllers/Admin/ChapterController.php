<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\BaseController;
use App\Services\ChapterService;
use Lib\ErrorHandler\ErrorHandler;
use OpenApi\Annotations as OA;

class ChapterController extends BaseController
{
    private ChapterService $chapterService;

    public function __construct()
    {
        $this->chapterService = \Lib\Container\ServiceContainer::getInstance()->get('chapterService');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/chapters/save",
     *     tags={"Admin Chapters"},
     *     summary="Create or Update chapter (Supports Batch)",
     *     description="Save a single chapter or a list of chapters (batch).",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(ref="#/components/schemas/ChapterSaveRequest"),
     *                 @OA\Schema(type="array", @OA\Items(ref="#/components/schemas/ChapterSaveRequest"))
     *             }
     *         )
     *     ),
     *     @OA\Response(response=200, description="Chapter saved")
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
                    $results[] = $this->chapterService->saveChapter($item);
                }
                $this->successResponse($results);
            } else {
                $result = $this->chapterService->saveChapter($data);
                $this->successResponse($result, 'Chapter saved successfully');
            }
        } catch (\Exception $e) {
            ErrorHandler::internalError($this, $e->getMessage());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/chapters/{id}",
     *     tags={"Admin Chapters"},
     *     summary="Delete chapter",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Chapter deleted")
     * )
     */
    public function delete($id)
    {
        try {
            $this->chapterService->deleteChapter((int) $id);
            $this->successResponse(null, 'Chapter deleted successfully');
        } catch (\Exception $e) {
            ErrorHandler::internalError($this, $e->getMessage());
        }
    }
}
