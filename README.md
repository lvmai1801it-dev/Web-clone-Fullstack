# Audio Trunyen Clone (Fullstack Project)

Dự án Fullstack bao gồm Backend (PHP) và Frontend (Next.js) cho hệ thống nghe truyện audio.

## 📂 Cấu trúc Dự án

Repository này chứa 2 phần chính:

*   **[`backend_php/`](./backend_php)**: API Service xử lý logic, database, xác thực.
    *   Công nghệ: PHP 8.1, MySQL, JWT.
    *   Tài liệu chi tiết: Xem [backend_php/README.md](./backend_php/README.md).
*   **[`audiotruyen-clone/`](./audiotruyen-clone)**: Giao diện người dùng (Web App).
    *   Công nghệ: Next.js (React), Tailwind CSS.
    *   Tài liệu chi tiết: Xem [audiotruyen-clone/README.md](./audiotruyen-clone/README.md).

## 🚀 Hướng dẫn Cài đặt (Quick Start)

### 1. Backend (PHP)

```bash
cd backend_php
composer install
# Cấu hình .env và import database
# Chạy server
php -S localhost:8000 -t public
```

### 2. Frontend (Next.js)

```bash
cd audiotruyen-clone
npm install
# Cấu hình .env.local (API URL trỏ về backend)
npm run dev
```

## 🔗 Liên kết quan trọng

*   **API Documentation (Swagger)**: `/docs/index.html` (trong `backend_php/public`).
*   **Demo**: [Link demo nếu có]

## 🛠️ Đóng góp

Vui lòng tạo Pull Request hoặc Issue nếu phát hiện lỗi.

---
*Dự án được xây dựng bởi AudioStories Team.*
