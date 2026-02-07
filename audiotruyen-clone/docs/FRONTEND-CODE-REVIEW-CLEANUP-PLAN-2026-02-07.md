# Frontend Code Review & Cleanup Plan

Ngày review: 2026-02-07  
Phạm vi: `audiotruyen-clone` (toàn bộ frontend trong `src/` + cấu hình FE)

## 1) Tóm tắt nhanh hiện trạng

- `lint` pass.
- `type-check` fail do test legacy không khớp props hiện tại:
  - `src/components/features/audio/SpeedControl.test.tsx`
- Test runner đang fail môi trường do thiếu optional dependency Rollup (`@rollup/rollup-linux-x64-gnu`).
- Có dấu hiệu code dư/legacy và lệch cấu trúc (barrel thừa, hook/UI chưa dùng, service chưa dùng, test fixture bị dùng trong runtime).

## 2) Findings ưu tiên cao (cần xử lý trước)

### P0

1. Runtime đang import test fixtures (`@/test/mocks`) ở page production:
   - `src/app/page.tsx`
   - `src/app/tim-kiem/page.tsx`
   - `src/app/the-loai/[slug]/page.tsx`
   - `src/app/truyen/[slug]/page.tsx`
   - `src/app/danh-sach/[slug]/page.tsx`
2. `search` page phụ thuộc mock data, trong production `mockStories = []`:
   - `src/test/mocks/mock-data.ts`
   - `src/app/tim-kiem/page.tsx`
3. Test suite lệch API component:
   - `src/components/features/audio/SpeedControl.tsx`
   - `src/components/features/audio/SpeedControl.test.tsx`

### P1

1. Dead/unused modules (candidate xóa hoặc tích hợp):
   - `src/components/ui/ButtonBridge.tsx`
   - `src/components/ui/BottomSheet.tsx`
   - `src/components/ui/PullToRefresh.tsx`
   - `src/components/features/audio/AudioErrorBoundary.tsx`
   - `src/hooks/useSwipeGesture.ts`
   - `src/hooks/useFocusTrap.ts` (chỉ đang dùng trong test)
   - `src/lib/accessibility.ts`
   - `src/services/auth.service.ts`
   - `src/services/author.service.ts`
   - `src/services/chapter.service.ts`
2. Barrel files dư (không có import thực tế):
   - `src/components/features/index.ts`
   - `src/components/features/audio/index.ts`
   - `src/components/features/story/index.ts`
   - `src/components/features/ranking/index.ts`
   - `src/components/layout/index.ts`
   - `src/components/layout/header/index.ts`
   - `src/components/layout/footer/index.ts`
3. Empty directories:
   - `src/app/api/search`
   - `src/components/theme`
   - `src/scripts`
4. `AppContext` đang được wrap global nhưng `useApp()` chưa có consumer runtime:
   - `src/contexts/AppContext.tsx`
   - `src/app/layout.tsx`

### P2

1. Dependencies có khả năng thừa (cần xác nhận và gỡ):
   - `@emotion/react`
   - `@emotion/styled`
   - `@mui/material`
   - `@mui/material-nextjs`
2. Link/routing không nhất quán:
   - `src/components/layout/header/MobileMenu.tsx` dùng `/login`
   - `src/components/mobile/BottomNavigation.tsx` dùng `/dang-nhap`
   - Chưa thấy route tương ứng trong `src/app/`

## 3) Kế hoạch xử lý chi tiết theo phase

## Phase 0 - Baseline & Safety

- [ ] Chốt baseline trước refactor:
  - `npm run lint`
  - `npm run type-check`
- [x] Sửa môi trường test để chạy được `vitest` ổn định.
- [ ] Tạo branch cleanup riêng để tránh đụng thay đổi feature.

Tiêu chí xong: chạy được `lint`, `type-check`, `test` trên local/CI.

## Phase 1 - Tách test data khỏi runtime (P0)

- [x] Gỡ import `@/test/mocks` khỏi các page runtime.
- [x] Tạo nguồn ranking/search dùng API thật hoặc fallback hợp lệ trong runtime:
  - Gợi ý: `src/services/ranking.service.ts` hoặc mở rộng `StoryService`.
- [x] Giữ `src/test/mocks/*` chỉ cho test.

Tiêu chí xong:
- Không còn import `@/test/mocks` trong `src/app/**` hoặc runtime components.
- Search page hoạt động bằng dữ liệu thật/fallback hợp lệ ở production.

## Phase 2 - Dọn dead code có bằng chứng (P1)

- [x] Xóa hoặc tích hợp các module không dùng (danh sách P1 ở trên).
- [x] Xóa barrel files không có consumer.
- [x] Xóa thư mục rỗng.
- [x] Nếu giữ lại module để roadmap sau, thêm TODO rõ owner + deadline (tránh “rác treo”).

Tiêu chí xong:
- Không còn file/module “không tham chiếu” ngoài test fixtures có chủ đích.

## Phase 3 - Chuẩn hóa state/types/services

- [ ] Quyết định số phận `AppContext`:
  - hoặc dùng thật (consumer rõ ràng),
  - hoặc bỏ hẳn để giảm provider/complexity.
- [ ] Tách rõ type runtime vs type test:
  - Runtime types ở `src/lib/types.ts` hoặc `src/types/domain/*`
  - Test types/fixtures ở `src/test/**`
- [x] Giảm service dư (auth/author/chapter) nếu FE hiện chưa dùng.

Tiêu chí xong:
- Mỗi context/service tồn tại đều có consumer thực tế.
- Không trùng lớp type không cần thiết.

## Phase 4 - Cleanup dependency & scripts

- [x] Gỡ dependencies FE không dùng (sau khi xác nhận import graph):
  - `@emotion/react`, `@emotion/styled`, `@mui/material`, `@mui/material-nextjs`
- [ ] Đồng bộ lại script lint/fix/typecheck/test cho thống nhất CI.
- [ ] Chạy lại lockfile.

Tiêu chí xong:
- `depcheck`/`ts-prune` không còn cảnh báo lớn.
- Build/test/lint pass sau khi gỡ dependency.

## Phase 5 - Guardrail chống tái phát

- [ ] Bật rule CI chặn import test fixture từ runtime (eslint `no-restricted-imports`).
- [ ] Thêm check định kỳ:
  - `ts-prune` cho export dư
  - `depcheck` cho dependency dư
- [ ] Thêm checklist PR:
  - Không import `src/test/**` vào runtime
  - Không thêm barrel nếu chưa có consumer

Tiêu chí xong:
- Có kiểm soát tự động để không tái sinh code rác.

## 4) Đề xuất cấu trúc mục tiêu (sau cleanup)

```text
src/
  app/
  components/
    features/
    layout/
    ui/
  services/
  lib/
  types/
  test/
```

Nguyên tắc:
- `test/` chỉ cho test.
- `ui/` chỉ giữ component đang dùng.
- Barrel export chỉ giữ ở nơi có consumer thật.

## 5) Lệnh verify sau mỗi phase

```bash
npm run lint
npm run type-check
npm test -- --run
npx ts-prune -p tsconfig.json
npx depcheck
```

## 6) Output mong đợi sau toàn bộ kế hoạch

- Giảm đáng kể file dư/legacy.
- Runtime không còn phụ thuộc mock test.
- Cấu trúc rõ ràng, dễ bảo trì.
- Chất lượng CI ổn định hơn, giảm regression khi mở rộng feature.
