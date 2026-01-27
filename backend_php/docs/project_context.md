# Bối cảnh Dự án & Kiến trúc

**Dự án:** PHPMusic/Audiobook Backend
**Framework:** Native PHP 8.1+ (Không dùng Framework)
**Kiến trúc:** MVC + Service/Repository Pattern

## Trạng thái hiện tại (Tính đến 27/01/2026)
Đã hoàn thành Giai đoạn 1 (Nền tảng), Giai đoạn 2 (Xác thực), Giai đoạn 3 (Nội dung Public), và Giai đoạn 8 (Tài liệu hóa).

## Các Quyết định Kỹ thuật Chính

### 1. Định tuyến (Routing)
- **Custom Router**: `Lib\Router\Router` sử dụng Regex để khớp các route định nghĩa trong `api/routes.php`.
- **Tương thích Windows**: `index.php` bao gồm logic chuẩn hóa dấu gạch chéo ngược (`\`) thành xuôi (`/`) cho `SCRIPT_NAME` để đảm bảo routing hoạt động trên Windows/XAMPP.
- **Hỗ trợ Thư mục con**: Router được thiết kế để hoạt động dù host ở root `/` hay thư mục con `/backend_php/public/`.

### 2. Cơ sở dữ liệu (Database)
- **PDO Singleton**: `Lib\Database\DatabaseConnection` đảm bảo chỉ có một kết nối DB duy nhất.
- **Raw SQL**: Tất cả truy vấn là SQL thuần tối ưu với Prepared Statements (không dùng ORM) để tối đa hóa hiệu năng trên shared hosting.
- **Schema**: Các bảng `users`, `authors`, `categories`, `stories`, `chapters`.

### 3. Xác thực (Authentication)
- **JWT**: Sử dụng thư viện `firebase/php-jwt`.
- **Luồng (Flow)**: `AuthController::login` -> Trả về Token. Client gửi `Authorization: Bearer <token>`.
- **Middleware**: `AuthMiddleware` xác minh token và inject thông tin User vào REQUEST.

### 4. Tài liệu (Documentation)
- **Swagger/OpenAPI**:
    - **Thư viện**: `zircote/swagger-php` + `doctrine/annotations`.
    - **Endpoint**: `/api/v1/swagger-doc` trả về JSON.
    - **UI**: `/docs/index.html` hiển thị giao diện (trỏ tới `../api/v1/swagger-doc`).
    - **Annotations**: Các Controllers (`AuthController`, `StoryController`, `CategoryController`, `AuthorController`, `HealthController`) đã được gắn annotation đầy đủ.

## Ghi chú Triển khai
- **Web Server**: Yêu cầu Apache (`.htaccess` dựa vào `mod_rewrite`).
- **Phiên bản PHP**: 8.1 hoặc cao hơn.
- **Extensions**: `pdo_mysql`, `mbstring`.
- **Môi trường**: Đổi tên `.env.example` thành `.env` và cấu hình thông tin DB.

## Các bước tiếp theo
- **Giai đoạn 4**: Cá nhân hóa Người dùng (Lịch sử, Đánh dấu).
- **Giai đoạn 5**: Mạng xã hội (Bình luận, Đánh giá).
