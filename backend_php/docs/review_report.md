# Báo cáo Review Code - PHP Backend (Audio Stories)

**Ngày review:** 27/01/2026
**Người thực hiện:** AI Agent (Antigravity)

Chào bạn, tôi đã thực hiện review lại toàn bộ source code hiện tại của dự án `backend_php`. Dưới đây là báo cáo chi tiết về tình trạng code, các lỗ hổng tìm thấy và đề xuất cải thiện.

## ✅ Điểm mạnh (Strong Points)

1.  **Kiến trúc (Architecture)**:
    *   Tổ chức thư mục rõ ràng, tuân thủ mô hình MVC.
    *   Sử dụng `strict_types=1` đồng bộ.
    *   Tách biệt tốt giữa Controllers và Repositories.

2.  **Bảo mật (Security)**:
    *   **Password Hashing**: Sử dụng `password_hash` chuẩn.
    *   **SQL Injection**: Sử dụng Prepared Statements (`PDO`) triệt để trong tất cả Repository đã kiểm tra (`UserRepository`, `StoryRepository`, `ChapterRepository`).
    *   **JWT Algorithm**: `JwtAuthenticator` ép buộc thuật toán từ config (tránh tấn công 'none' algorithm).

## ⚠️ Các vấn đề cần cải thiện (Critical & High Priority)

### 1. 🚨 Lỗi Logic Validation Email (CRITICAL)
*   **File**: `lib/Validator/RequestValidator.php`
*   **Mô tả**: Logic kiểm tra rules đang nằm trong khối `if (str_contains($rule, ':'))`.
*   **Vấn đề**: Các rule không có tham số như `'email'`, `'required'` (nếu không viết dạng `required:true`?) đang bị bỏ qua nếu chúng không chứa dấu hai chấm.
*   **Chi tiết**:
    ```php
    // Dòng 39: Logic bắt đầu kiểm tra params
    if (str_contains($rule, ':')) {
        // ...
        // Dòng 50: Logic email check nằm trong này
        if ($value !== null && $ruleName === 'email' && ...)
    }
    ```
    Nếu gọi `['email' => ['required', 'email']]`, rule `email` sẽ không bao giờ chạy vì chuỗi "email" không chứa ":".
*   **Hệ quả**: Người dùng có thể đăng ký với email không hợp lệ.

### 2. ❌ Thiếu kiểm tra Soft Delete (HIGH)
*   **Files**: `app/Repositories/StoryRepository.php`, `app/Repositories/ChapterRepository.php`
*   **Mô tả**: Các câu truy vấn lấy dữ liệu (`SELECT`) không kiểm tra cột `deleted_at`.
*   **Chi tiết**:
    *   `StoryRepository::getStories`: `WHERE 1=1 ...` (Thiếu `AND s.deleted_at IS NULL`)
    *   `StoryRepository::findById`: Thiếu check.
    *   `StoryRepository::findBySlug`: Thiếu check.
    *   `ChapterRepository::getChaptersByStoryId`: Thiếu check.
*   **Hệ quả**: Các truyện và chương đã xóa (soft deleted) vẫn hiển thị trên API Public. Dữ liệu rác xuất hiện.

### 3. ⚠️ Kiểm soát input trong Controller (MEDIUM)
*   **File**: `app/Controllers/StoryController.php`
*   **Mô tả**: Method `index()` truy cập trực tiếp biến global `$_GET`.
    ```php
    'search' => $_GET['q'] ?? null,
    'page' => isset($_GET['page']) ? (int) $_GET['page'] : 1,
    ```
*   **Vấn đề**: Mặc dù đã có ép kiểu `(int)`, việc truy cập trực tiếp Global Superglobals là bad practice, khó test và khó bảo trì. Nên thông qua lớp `RequestValidator` hoặc wrapper `Request`.

## ℹ️ Các vấn đề kiến trúc & Refactor (Low Priority)

4.  **Dependency Injection (DI)**
    *   Hiện tại các Controller đang khởi tạo trực tiếp dependencies (`new StoryRepository`, `new DatabaseConnection`).
    *   **Đề xuất**: Trong tương lai nên chuyển sang inject qua Constructor để dễ dàng Unit Test (Mocking).

5.  **Hardcoded Middleware logic**
    *   `AuthController::profile()` đang gọi `new AuthMiddleware()->handle()` thủ công.
    *   **Đề xuất**: Nếu phát triển router framework, nên hỗ trợ middleware pipeline tự động.

## 🚀 Kế hoạch khắc phục (Action Plan)

Để đảm bảo chất lượng và an toàn hệ thống, tôi đề xuất thực hiện các sửa lỗi theo thứ tự ưu tiên sau ngay lập tức:

1.  **FIX 1 (Nghiêm trọng)**: Sửa lại logic `lib/Validator/RequestValidator.php` để các single rule (không có `:`) vẫn hoạt động.
2.  **FIX 2 (Quan trọng)**: Thêm điều kiện `AND deleted_at IS NULL` vào tất cả các query trong `StoryRepository` và `ChapterRepository`.
3.  **FIX 3 (Cải thiện)**: Refactor `StoryController` để sử dụng `RequestValidator` cho việc lấy và validate tham số filter.

Bạn có thể yêu cầu tôi thực hiện ngay các fix này.
