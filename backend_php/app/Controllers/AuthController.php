<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use App\Services\AuthService;
use Lib\Validator\RequestValidator;
use OpenApi\Annotations as OA;

class AuthController extends BaseController
{
    private AuthService $authService;
    private RequestValidator $validator;
    private \Lib\Logger\Logger $logger;


    public function __construct()
    {
        // Use ServiceContainer to get dependencies
        $container = \Lib\Container\ServiceContainer::getInstance();

        $this->authService = $container->get('authService');
        $this->validator = $container->get('validator');
        $this->logger = $container->get(\Lib\Logger\Logger::class);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user/register",
     *     tags={"Auth"},
     *     summary="Register a new user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password","username"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123"),
     *             @OA\Property(property="username", type="string", example="johndoe"),
     *             @OA\Property(property="full_name", type="string", example="John Doe")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation Error"
     *     )
     * )
     */
    public function register()
    {
        // 1. Lấy dữ liệu JSON từ client gửi lên
        $data = $this->getJsonBody();

        // 2. Định nghĩa luật validation (Ràng buộc dữ liệu)
        $rules = [
            'username' => ['required', 'string', 'min:3', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
            'full_name' => ['string', 'max:100']
        ];

        // 3. Kiểm tra dữ liệu
        if (!$this->validator->validateAndRespond($data, $rules, $this)) {
            $this->logger->warning('Register validation failed', ['data' => $data]);
            return;
        }

        // 4. Sanitize (Làm sạch dữ liệu để chống XSS)
        $cleanData = $this->validator->getCleanData($data, $rules);

        // 5. Gọi Service để xử lý logic đăng ký
        $user = $this->authService->register($cleanData);

        // Log success
        $this->logger->info('User registered successfully', ['user_id' => $user->id, 'email' => $user->email]);

        // 6. Trả về kết quả thành công (201 Created)
        $this->successResponse($user, 'Đăng ký thành công', 201);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user/login",
     *     tags={"Auth"},
     *     summary="Login user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login Successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="token", type="string", example="eyJhbGci...")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials"
     *     )
     * )
     */
    public function login()
    {
        $data = $this->getJsonBody();

        // Validate cơ bản
        $rules = [
            'email' => ['required', 'email'],
            'password' => ['required', 'string']
        ];

        if (!$this->validator->validateAndRespond($data, $rules, $this)) {
            return;
        }

        try {
            // Gọi Service xử lý đăng nhập & lấy token
            $result = $this->authService->login($data['email'], $data['password']);

            $this->logger->info('User logged in', ['email' => $data['email']]);
            $this->successResponse($result, 'Đăng nhập thành công');
        } catch (\Exception $e) {
            $this->logger->warning('Login failed', ['email' => $data['email'], 'reason' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user/logout",
     *     tags={"Auth"},
     *     summary="Logout user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout Successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Đăng xuất thành công")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function logout()
    {
        // 1. Với Stateless JWT, server không lưu session nên không thể "delete session".
        // 2. Client chịu trách nhiệm xóa token khỏi LocalStorage/Cookie.
        // 3. (Tuỳ chọn) Server có thể blacklist token này trong Redis nếu cần bảo mật cao (chưa implement ở đây).

        // Chỉ cần trả về success để client biết response ok
        $this->successResponse(null, 'Đăng xuất thành công (Vui lòng xóa token phía Client)');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/user/profile",
     *     tags={"Auth"},
     *     summary="Get User Profile",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User Profile Data"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function profile()
    {
        // 1. Kích hoạt Middleware kiểm tra Token
        // Vì router đơn giản chưa hỗ trợ middleware config, ta gọi thủ công ở đây
        // Trong thực tế (Laravel/Symfony), việc này được cấu hình ở Router
        try {
            $middleware = new \Api\V1\Middleware\AuthMiddleware();
            $middleware->handle(); // Nếu k có token hoặc sai sẽ throw Exception 401
        } catch (\App\Exceptions\AuthenticationException $e) {
            // Ném tiếp để Global Handler xử lý trả về 401
            throw $e;
        }

        // 2. Lấy thông tin user đã được Middleware giải mã
        $userFromToken = $_REQUEST['user'] ?? null;

        $this->successResponse($userFromToken, 'Lấy thông tin profile thành công');
    }
}
