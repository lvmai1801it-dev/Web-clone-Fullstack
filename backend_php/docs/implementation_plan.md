# Kế hoạch Triển khai - Backend PHP (MVC Nghiêm ngặt & Service Layer)

## 📋 Mục tiêu
Xây dựng một RESTful API mạnh mẽ, có khả năng mở rộng và bảo mật cho nền tảng Sách nói (Audiobook) sử dụng **PHP 8.1+ hiện đại** trên Shared Hosting.
**Tuân thủ nghiêm ngặt**: `requirements_features.md` (Tính năng) + `architecture_rules.md` (Kiến trúc & Tiêu chuẩn).

## 🏗️ Kiến trúc & Cấu trúc
Chúng tôi tuân theo **Mô hình MVC Nghiêm ngặt + Service Repository** đã được định nghĩa trong `architecture_rules.md`.

### Cấu trúc thư mục
```
backend_php/
├── api/                    # Điểm vào API & Routes
│   ├── v1/                
├── app/                    # Logic nghiệp vụ cốt lõi
│   ├── Core/               # Các lớp cơ sở (Controller, Model)
│   ├── Controllers/        # Tầng giao vận (HTTP request/response)
│   ├── Models/             # Mô hình dữ liệu Eloquent/PDO
│   ├── Services/           # Logic nghiệp vụ (Transaction scripts)
│   ├── Repositories/       # Trừu tượng hóa truy cập dữ liệu (Data Access)
├── config/                 # Các file cấu hình
├── lib/                    # Thư viện chia sẻ
│   ├── Database/           # Connection/Wrapper PDO
│   ├── Auth/               # Xử lý JWT
│   ├── Validator/          # Kiểm tra dữ liệu đầu vào
│   └── Logger/             # Ghi log chuẩn PSR
├── public/                 # Thư mục gốc Web (Web Root)
│   ├── docs/               # Swagger UI
│   ├── index.php           # Front Controller
│   └── .htaccess           # Quy tắc định tuyến
└── storage/                # Dữ liệu thay đổi (Mutable Data)
```

## 🧩 Các thành phần chính

### 1. Vòng đời Request
1.  **Public/Index**: Khởi động app, load biến môi trường, xử lý CORS, chuẩn hóa đường dẫn (Win/Linux).
2.  **Router**: Điều hướng URL đến Controller tương ứng.
3.  **Middleware**: Kiểm tra xác thực (Auth), giới hạn tốc độ (Rate limiting).
4.  **Controller**:
    *   Validate dữ liệu vào qua `Validator`.
    *   Gọi `Service` hoặc `Repository`.
    *   Trả về `JsonResponse`.
5.  **Repository**:
    *   Thực thi SQL tối ưu (Prepared Statements).
    *   Trả về Mảng/Models.

### 2. Tiêu chuẩn hóa
*   **Phản hồi (Response)**: Định dạng JSON thống nhất `{ success, message, data }`.
*   **Xử lý lỗi**: Trình xử lý ngoại lệ toàn cục chuyển đổi Exception thành JSON.
*   **Cơ sở dữ liệu**: PDO Singleton với chế độ báo lỗi nghiêm ngặt.
*   **Bảo mật**: JWT cho xác thực, Bcrypt cho mật khẩu, kiểm soát đầu vào nghiêm ngặt.
*   **Tài liệu**: Swagger/OpenAPI 3.0 tự động tạo từ annotation trong code.

## ⚠️ Checklist quan trọng (Trước khi triển khai)
*   [ ] Đảm bảo `composer` có sẵn cục bộ để tạo thư mục `vendor/`.
*   [ ] Đảm bảo module rewrite của `apache` (xampp/laragon) đã được bật.
