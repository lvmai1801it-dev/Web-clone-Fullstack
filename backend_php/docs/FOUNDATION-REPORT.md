# Báo cáo Hoàn thành Foundation Catch-up

## 1. Tính năng Xác thực (Auth)
- **Yêu cầu**: Bổ sung tính năng Đăng xuất (Logout).
- **Thay đổi**:
  - `AuthController.php`: Thêm method `logout`.
  - `api/routes.php`: Đăng ký route `POST /api/v1/user/logout`.
- **Ghi chú**: Do sử dụng Stateless JWT, API chỉ trả về thành công để Client xóa token. Backend không cần thao tác database (trừ khi muốn blacklist token trong Redis - feature nâng cao chưa có trong scope này).

## 2. Hệ thống Tags
- **Yêu cầu**: Quản lý thẻ phân loại truyện.
- **Thay đổi**:
  - **Database**: Tạo schema SQL cho bảng `tags` và `story_tags` tại `app/Models/schema_tags.sql`.
  - **Repository**: `TagRepository.php` (CRUD đầy đủ, lấy tags theo story).
  - **Controller**: `TagController.php` (API endpoints chuẩn REST).
  - **Routes**:
    - `GET /api/v1/public/tags`: Lấy danh sách tags (Public).
    - `POST /api/v1/tags`: Tạo tag mới (Management).
    - `DELETE /api/v1/tags/{id}`: Xóa tag (Management).

## 3. Hướng dẫn Review
Vui lòng kiểm tra các file code sau để đảm bảo đúng kiến trúc Repository Pattern và Coding Convention của dự án:
1. `app/Controllers/AuthController.php`
2. `app/Models/schema_tags.sql`
3. `app/Repositories/TagRepository.php`
4. `app/Controllers/TagController.php`
5. `api/routes.php`

## 4. Bước tiếp theo
Sau khi review và merge, có thể chạy file SQL `schema_tags.sql` vào database và tiếp tục triển khai **Sprint 4 (Comments System)**.
