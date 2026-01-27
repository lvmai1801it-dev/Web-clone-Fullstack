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
    public function register(array $data): array
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
        $user = $this->userRepository->findById($userId);

        // Loại bỏ password khỏi kết quả trả về để bảo mật
        unset($user['password']);

        return $user;
    }

    // Hàm Đăng nhập
    public function login(string $email, string $password): array
    {
        // 1. Tìm user trong database theo email
        $user = $this->userRepository->findByEmail($email);

        // 2. Kiểm tra mật khẩu
        // password_verify so sánh mật khẩu nhập vào (thô) với hash trong db (cột 'password')
        if (!$user || !password_verify($password, $user['password'])) {
            throw new AuthenticationException("Email hoặc mật khẩu không chính xác");
        }

        // Kiểm tra trạng thái tài khoản
        // Sử dụng ?? 'active' để tránh lỗi nếu cột status không tồn tại trong DB
        if (($user['status'] ?? 'active') === 'banned') {
            throw new AuthenticationException("Tài khoản này đã bị khóa");
        }

        // 3. Sinh Token JWT (Giấy thông hành)
        // Token này chứa ID và Email, user sẽ gửi kèm token này ở các request sau
        $token = $this->jwt->createToken([
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        unset($user['password']);

        return [
            'token' => $token,
            'user' => $user
        ];
    }
}
