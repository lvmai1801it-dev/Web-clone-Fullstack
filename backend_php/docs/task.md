# Theo dõi Tiến độ - PHP Backend

File này theo dõi tiến độ chi tiết của việc triển khai Backend PHP.

## Giai đoạn 1: Nền tảng & Kiến trúc cốt lõi
### 1.1 Thiết lập dự án
- [x] Tạo cấu trúc thư mục (`api`, `app`, `config`, `lib`, `public`, `storage`)
- [x] Khởi tạo `composer.json` với PSR-4 Autoloading (`App\\`)
- [x] Tạo `.env.example` và quy tắc an toàn `.gitignore`
- [x] Tạo `public/.htaccess` để viết lại URL (URL rewriting)
- [x] Tạo điểm vào `public/index.php`

### 1.2 Thư viện cốt lõi (lib/)
- [x] Triển khai bộ nạp `Core/Config.php`
- [x] Triển khai `lib/Logger/Logger.php` (Ghi log ra file)
- [x] Triển khai `lib/Database/DatabaseConnection.php` (Kết nối PDO Singleton)
- [x] Triển khai `lib/Validator/RequestValidator.php` (Làm sạch & Xác thực dữ liệu)
- [x] Triển khai `Core/BaseController.php` (Hỗ trợ phản hồi: success, error)
- [x] Triển khai `Core/BaseRepository.php` (Các phương thức PDO chung)
- [x] Triển khai `Core/BaseService.php` 
- [x] (Tùy chọn) Triển khai Refresh Token (Bỏ qua cho bản MVP) 

### 1.3 Xử lý lỗi & Định tuyến
- [x] Tạo phân cấp `app/Exceptions/AppException.php`
- [x] Triển khai Xử lý lỗi toàn cục trong `index.php`
- [x] Triển khai Router đơn giản hoặc tích hợp thư viện Router
- [x] Triển khai `api/middleware/CorsMiddleware.php`

## Giai đoạn 2: Hệ thống Xác thực
### 2.1 Cơ sở dữ liệu (Users)
- [x] Tạo SQL: bảng `users` (id, email, password_hash, role, avatars)
- [x] Tạo SQL: bảng `user_sessions` hoặc `refresh_tokens`

### 2.2 Logic Xác thực
- [x] Triển khai `lib/Auth/JwtAuthenticator.php` (Mã hóa/Giải mã)
- [x] Triển khai `app/Middleware/AuthMiddleware.php` (Kiểm tra token Bearer)
- [x] Triển khai `app/Repositories/UserRepository.php` (findByEmail, create)
- [x] Triển khai `app/Services/AuthService.php` (Logic Đăng nhập, Đăng ký)

### 2.3 API Xác thực
- [x] Tạo `app/Controllers/AuthController.php`
- [x] Định nghĩa Route: `POST /v1/user/register` -> `AuthController::register`
- [x] Định nghĩa Route: `POST /v1/user/login` -> `AuthController::login`
- [x] Định nghĩa Route: `GET /v1/user/profile` -> `AuthController::profile`
- [x] Định nghĩa Route: `POST /v1/user/refresh-token` -> `AuthController::refresh` (Bỏ qua MVP)

## Giai đoạn 3: Khám phá Nội dung (Public)
### 3.1 Cơ sở dữ liệu (Content)
- [x] Tạo SQL: bảng `authors` (tác giả)
- [x] Tạo SQL: bảng `categories` (thể loại)
- [x] Tạo SQL: bảng `stories` (truyện)
- [x] Tạo SQL: bảng `chapters` (chương)

### 3.2 Repositories & Models Nội dung
- [x] Triển khai `app/Models/Story.php`, `Chapter.php` (DTO khớp với Schema)
- [x] Triển khai `app/Repositories/AuthorRepository.php`
- [x] Triển khai `app/Repositories/CategoryRepository.php`
- [x] Triển khai `app/Repositories/StoryRepository.php` (Lọc, Sắp xếp, Tìm kiếm)
- [x] Triển khai `app/Repositories/ChapterRepository.php`

### 3.3 Services Nội dung
- [x] Triển khai `app/Services/BrowseService.php` (Logic caching cho danh sách) - *Gộp vào Controller cho MVP*
- [x] Triển khai `app/Services/StoryService.php` (Logic chi tiết + Đếm lượt xem) - *Gộp vào Controller cho MVP*

### 3.4 API Public
- [x] Route: `GET /v1/public/stories` (Danh sách)
- [x] Route: `GET /v1/public/stories/{slug}` (Chi tiết)
- [x] Route: `GET /v1/public/stories/{slug}/chapters` (Danh sách chương)
- [x] Route: `GET /v1/public/stories/{id}/chapters` (Chương theo ID)
- [x] Route: `GET /v1/public/authors` (Danh sách Tác giả)
- [x] Route: `GET /v1/public/categories` (Danh sách Thể loại)

## Giai đoạn 4: Cá nhân hóa (User Personalization)
### 4.1 Cơ sở dữ liệu (User Data)
- [ ] Tạo SQL: bảng `listening_history` (lịch sử nghe)
- [ ] Tạo SQL: bảng `bookmarks` (đánh dấu)
- [ ] Tạo SQL: bảng `playlists` & `playlist_items`

### 4.2 Triển khai Tính năng Người dùng
- [ ] Triển khai `app/Repositories/UserLibraryRepository.php`
- [ ] Triển khai `app/Services/UserLibraryService.php`
- [ ] Triển khai `app/Controllers/UserLibraryController.php`

### 4.3 API Người dùng
- [ ] Route: `POST /v1/user/history` (Ghi lại tiến độ)
- [ ] Route: `GET /v1/user/history`
- [ ] Route: `POST/DELETE /v1/user/bookmarks`
- [ ] Route: `CRUD /v1/user/playlists`

## Giai đoạn 5: Tương tác & Xã hội
### 5.1 Cơ sở dữ liệu
- [ ] Tạo SQL: bảng `ratings`, `comments`

### 5.2 Logic Tương tác
- [ ] Triển khai `CommentRepository` & `RatingRepository`
- [ ] Triển khai `InteractionService` (Xử lý logic + ràng buộc)
- [ ] Triển khai `InteractionController`

### 5.3 API Tương tác
- [ ] Route: `POST /v1/stories/{id}/rate`
- [ ] Route: `POST /v1/stories/{id}/comment`
- [ ] Route: `GET /v1/stories/{id}/comments`

## Giai đoạn 6: Cổng Creator (Người sáng tạo)
### 6.1 Logic Creator
- [ ] Middleware: `CreatorRoleMiddleware`
- [ ] Triển khai `CreatorService` (Xử lý upload file)
- [ ] Triển khai `app/Controllers/CreatorController.php`

### 6.2 API Creator
- [ ] Route: `POST /v1/creator/stories`
- [ ] Route: `POST /v1/creator/stories/{id}/chapters` (Upload MP3)
- [ ] Route: `GET /v1/creator/analytics`

## Giai đoạn 7: Hệ thống Admin
### 7.1 Logic Admin
- [ ] Middleware: `AdminRoleMiddleware`
- [ ] Triển khai `AdminService` (Cấm user, Duyệt bài)
- [ ] Triển khai `app/Controllers/AdminController.php`

### 7.2 API Admin
- [ ] Route: `GET /v1/admin/dashboard`
- [ ] Route: `PUT /v1/admin/users/{id}/status`
- [ ] Route: `PUT /v1/admin/stories/{id}/approve`

## Giai đoạn 8: Tài liệu (Swagger/OpenAPI)
- [x] Cài đặt `zircote/swagger-php` & `doctrine/annotations`
- [x] Cấu hình `SwaggerController` (Tạo JSON)
- [x] Thiết lập Swagger UI (public/docs)
- [x] Annotation cho `AuthController`
- [x] Annotation cho `StoryController`
- [x] Annotation cho `AuthorController`
- [x] Annotation cho `CategoryController`
- [x] Annotation cho `HealthController`

## Giai đoạn 9: Kiểm tra & Hoàn thiện
- [x] Chạy Full API Test Suite (Postman/Curl) - Health Check OK
- [/] Review toàn bộ code & Fix lỗi nhỏ
  - [x] Review kiến trúc & bảo mật
  - [ ] Sửa lỗi `email` rule trong `RequestValidator`
  - [ ] Thêm `deleted_at IS NULL` cho `StoryRepository`
  - [ ] Refactor `StoryController` dùng `RequestValidator`
- [ ] Kiểm tra Hiệu năng (Thời gian phản hồi)
- [ ] Rà soát Bảo mật lần cuối (SQL Injection, XSS)
