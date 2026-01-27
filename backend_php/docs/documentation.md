# Tài liệu Backend Audio Stories API

## Giới thiệu
Đây là một REST API nhẹ, hiệu năng cao được phát triển bằng PHP 8.1 thuần cho nền tảng Sách nói. Nó tuân theo kiến trúc MVC nghiêm ngặt và nguyên lý Clean Code.

## 🔗 Liên kết nhanh
- **Swagger UI**: `[YOUR_DOMAIN]/public/docs/index.html` (Tài liệu tương tác)
- **JSON Spec**: `[YOUR_DOMAIN]/api/v1/swagger-doc`

## 📚 Tham chiếu API (Tóm tắt)

### Hệ thống
- `GET /api/v1/health` - Kiểm tra trạng thái API.

### Xác thực (`Auth`)
- `POST /api/v1/user/register` - Đăng ký tài khoản mới.
- `POST /api/v1/user/login` - Lấy JWT Access Token.
- `GET /api/v1/user/profile` - Lấy thông tin user hiện tại (Yêu cầu Token).

### Nội dung Public (`Stories`)
- `GET /api/v1/public/stories` - Lấy danh sách truyện có bộ lọc.
    - **Tham số**: `q` (tìm kiếm), `category_id`, `author_id`, `sort`, `page`, `limit`.
- `GET /api/v1/public/stories/{idOrSlug}` - Lấy chi tiết truyện.
    - **Tối ưu**: Truyền `?with_chapters=1` để lấy luôn chương trong cùng 1 call.
- `GET /api/v1/public/stories/{id}/chapters` - Lấy danh sách chương có phân trang.

### Dữ liệu Meta (`Metadata`)
- `GET /api/v1/public/categories` - Danh sách tất cả thể loại.
- `GET /api/v1/public/authors` - Danh sách tác giả (có tìm kiếm).

## 🛠️ Hướng dẫn Phát triển

### 1. Yêu cầu tiên quyết
- PHP 8.1+
- Composer
- MySQL 8.0+

### 2. Cài đặt
```bash
# Cài đặt Dependencies
composer install

# Cấu hình Môi trường
cp .env.example .env
# Chỉnh sửa .env với thông tin DB của bạn
```

### 3. Thêm một API mới
1.  **Tạo Controller**: `app/Controllers/NewController.php`.
2.  **Thêm Logic**: Triển khai các methods. Sử dụng các hàm của `BaseController` như `$this->successResponse()`.
3.  **Annotate**: Thêm comment `/** @OA\... */` bên trên method cho Swagger.
4.  **Đăng ký Route**: Thêm dòng mới vào `api/routes.php`.
    ```php
    $router->get('/api/v1/resource', [NewController::class, 'index']);
    ```

### 4. Khắc phục sự cố (Troubleshooting)
- **404 Not Found**: Kiểm tra `public/.htaccess` và đảm bảo `mod_rewrite` đã bật. Trên Windows, đảm bảo `index.php` có fix chuẩn hóa đường dẫn.
- **Swagger Trống**: Đảm bảo có `use OpenApi\Annotations as OA;` trong Controller và đã cài `doctrine/annotations`.

## 📂 Cấu trúc Dự án
Xem `project_context.md` để biết chi tiết về kiến trúc.
