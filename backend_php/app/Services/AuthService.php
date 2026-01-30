<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\BaseService;
use App\Repositories\UserRepository;
use Lib\Auth\JwtAuthenticator;
use App\Exceptions\ValidationException;
use App\Exceptions\AuthenticationException;

class AuthService extends BaseService
{
    private UserRepository $userRepository;
    private JwtAuthenticator $jwt;

    public function __construct(UserRepository $userRepository, JwtAuthenticator $jwt)
    {
        $this->userRepository = $userRepository;
        $this->jwt = $jwt;
    }

    // Hàm Đăng ký thành viên mới
    public function register(array $data): \App\DTOs\UserDto
    {
        // 1. Kiểm tra xem email đã tồn tại chưa
        if ($this->userRepository->exists($data['email'])) {
            throw new ValidationException(['email' => 'Email này đã được sử dụng']);
        }

        // 2. Mã hóa mật khẩu (Tuyệt đối không lưu mật khẩu thô)
        // Sử dụng thuật toán BCRYPT chuẩn bảo mật
        // Lưu ý: Ghi đè vào key 'password' để Repository lưu vào cột 'password'
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);

        // 3. Gọi Repository để lưu user vào Database
        $userId = $this->userRepository->create($data);

        // 4. Lấy thông tin user vừa tạo để trả về
        return $this->userRepository->findById($userId);
    }

    // Hàm Đăng nhập
    public function login(string $email, string $password): array
    {
        // 1. Tìm user trong database theo email
        $user = $this->userRepository->findByEmail($email);

        // 2. Kiểm tra mật khẩu
        // password_verify so sánh mật khẩu nhập vào (thô) với hash trong db (cột 'password')
        if (!$user || !password_verify($password, $user->getPassword() ?? '')) {
            throw new AuthenticationException("Email hoặc mật khẩu không chính xác");
        }

        // 3. Sinh Token JWT (Giấy thông hành)
        // Token này chứa ID và Email, user sẽ gửi kèm token này ở các request sau
        // Check environment for Admin Infinite Token
        $expiration = null;
        if (($user->role ?? '') === \App\Constants\AppConstants::ROLE_ADMIN && \App\Core\Config::get('APP_ENV') === \App\Constants\AppConstants::ENV_LOCAL) {
            $expiration = \App\Constants\AppConstants::TOKEN_EXPIRY_LONG; // 10 years (effectively infinite for dev)
        }

        $token = $this->jwt->createToken([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role
        ], $expiration);

        return [
            'token' => $token,
            'user' => $user
        ];
    }
}
