# Dự án PHP Backend (Audio Stories)

Chào mừng bạn đến với dự án Backend của hệ thống Audio Stories.

## 📂 Cấu trúc Tài liệu & Hướng dẫn Đọc

Mọi tài liệu quy hoạch, kiến trúc và theo dõi tiến độ đều được lưu trong thư mục `docs/`. **Vui lòng đọc theo logic sau để hiểu đầy đủ cấu trúc dự án:**

### 🎯 Logic Đọc Tài liệu (Từ cơ bản → chi tiết)

#### **BƯỚC 1: Hiểu Bối cảnh Dự án (5-10 phút)**
1. **[PROJECT-OVERVIEW.md](docs/PROJECT-OVERVIEW.md)**: Tổng quan dự án, công nghệ sử dụng, quyết định kiến trúc

#### **BƯỚC 2: Hiểu Yêu cầu & Tính năng (10-15 phút)**
2. **[FEATURES-SPECIFICATION.md](docs/FEATURES-SPECIFICATION.md)**: Chi tiết các yêu cầu chức năng và feature

#### **BƯỚC 3: Nắm Các Quy tắc Kiến trúc (10 phút)**
3. **[CODE-STANDARDS.md](docs/CODE-STANDARDS.md)**: Các quy tắc kiến trúc (MVC, Repository, Middleware) bắt buộc tuân thủ

#### **BƯỚC 4: Tìm Hiểu Chi tiết Hệ thống (20-30 phút)**
Chọn một trong các walkthroughs sau tùy interest:
- **[WALKTHROUGH-CHAPTERS.md](docs/WALKTHROUGH-CHAPTERS.md)**: Tìm hiểu hệ thống Chapter (CRUD, Soft Delete)
- **[WALKTHROUGH-CORE.md](docs/WALKTHROUGH-CORE.md)**: Tìm hiểu Core optimization (Base Classes, DI Pattern)
- **[WALKTHROUGH-PUBLIC-API.md](docs/WALKTHROUGH-PUBLIC-API.md)**: Tìm hiểu Public API (Stories, Categories)

#### **BƯỚC 5: Xem Hướng dẫn Developer (15-20 phút)**
5. **[DEVELOPER-GUIDE.md](docs/DEVELOPER-GUIDE.md)**: Hướng dẫn tổng quan (Cài đặt, Setup, API Reference)

#### **BƯỚC 6: Kiểm tra Danh sách Công việc Hiện tại (5 phút)**
6. **[TASKS-CURRENT.md](docs/TASKS-CURRENT.md)**: ✅ Danh sách đầu việc (Checklist) và tiến độ chi tiết của dự án

---

### 📊 Tài liệu Khác (Tham khảo khi cần)

#### **Code Review & Refactoring**
- **[README-CODE-REVIEW.md](docs/README-CODE-REVIEW.md)**: Index tất cả tài liệu review code (đọc tiếp)
- **[CODE-REVIEW-SUMMARY.md](docs/CODE-REVIEW-SUMMARY.md)**: Tóm tắt 24 issues tìm thấy, đề xuất cải tiến
- **[FULL-CODE-REVIEW.md](docs/FULL-CODE-REVIEW.md)**: Báo cáo review code chi tiết (24 issues với code examples)
- **[STRUCTURE-ANALYSIS.md](docs/STRUCTURE-ANALYSIS.md)**: Phân tích cấu trúc tài liệu và optimization

#### **Kế hoạch & Báo cáo**
- **[REFACTORING-PLAN.md](docs/REFACTORING-PLAN.md)**: Kế hoạch refactoring chi tiết (timeline, effort estimate)
- **[SPRINT-4-PLAN.md](docs/SPRINT-4-PLAN.md)**: Kế hoạch Sprint 4 chi tiết
- **[FOUNDATION-REPORT.md](docs/FOUNDATION-REPORT.md)**: Báo cáo nền tảng dự án
- **[TASKS-ORIGINAL.md](docs/TASKS-ORIGINAL.md)**: Danh sách công việc gốc (tham khảo lịch sử)

#### **Implementation & Guides**
- **[refactoring-implementation-guide.md](docs/refactoring-implementation-guide.md)**: Hướng dẫn từng bước implement các fix

## 🚀 Trạng thái hiện tại
*   **Core**: Hoàn thành.
*   **Auth**: Hoàn thành.
*   **Public Content API**: Hoàn thành.
*   **Swagger Docs**: Hoàn thành.

## 🛠️ Bắt đầu nhanh
1.  Cài đặt dependencies: `composer install`
2.  Cấu hình `.env` (copy từ `.env.example`)
3.  Chạy server: Dùng XAMPP/Laragon trỏ tới thư mục `public` hoặc dùng PHP built-in server.
4.  Xem API Docs: Truy cập `/docs/index.html`.

---
*Created by AI Agent - 2026*
