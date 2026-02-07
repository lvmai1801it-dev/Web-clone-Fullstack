# Frontend Re-Review Tasks (2026-02-07)

Phạm vi: `audiotruyen-clone`  
Mục tiêu: tách task rõ ràng để làm lần lượt, giảm rủi ro regression.

## 1. Snapshot hiện tại

- `npm run lint`: pass
- `npm run type-check`: pass
- `npm run build`: pass
- `npm test -- --run`: fail (46 tests fail)

## 2. Ưu tiên xử lý

1. `P0` Sửa test suite đỏ hàng loạt để khôi phục safety net.
2. `P1` Chuẩn hóa route đăng nhập (`/login` vs `/dang-nhap`).
3. `P1` Tối ưu call API thừa ở trang chủ/search.
4. `P2` Dọn barrel exports dư.

## 3. Task breakdown theo phần

## Part 3 - Sửa lỗi Test Suite (P0)

- [x] Fix lỗi môi trường: `@rollup/rollup-win32-x64-msvc`.
- [x] `src/contexts/AudioContext.test.tsx` (Pass).
- [x] `src/components/features/audio/SpeedControl.test.tsx` (Pass: Radix UI interaction fixed).
- [ ] Chạy lại toàn bộ test: `npm test`
  - Note: Vẫn còn các test khác cần fix sau (search, integration).
  - `npm test -- src/contexts/AudioContext.test.tsx --run`

Done khi:
- Test file `AudioContext` pass hoàn toàn.


- [ ] Sửa `src/components/features/audio/ChapterSelector.test.tsx` theo behavior của `Select` (không còn native `option`).
- [ ] Sửa `src/components/features/audio/SpeedControl.test.tsx` theo dropdown menu Radix thực tế.
- [ ] Sửa `src/components/ui/Pagination.test.tsx` theo text/label hiện tại (`Trình trước`, `Trình sau`, aria-label).
- [ ] Sửa `src/components/features/audio/AudioProgressBar.test.tsx` theo event/value format của slider hiện tại.
- [ ] Sửa `src/components/features/audio/VolumeControl.test.tsx` theo slider/button hiện tại.
- [ ] Chạy nhóm test audio/ui:
  - `npm test -- src/components/features/audio src/components/ui/Pagination.test.tsx --run`

Done khi:
- Các test UI/audio kể trên pass.

## Part 3 - Sửa test integration/search đang timeout hoặc assert cũ (P0)

- [ ] `src/hooks/useSearch.test.ts`: xử lý debounce + fake timers đúng cách để không timeout.
- [ ] `src/components/features/audio/AudioPlayer.test.tsx`: sửa interaction chapter selector theo Radix.
- [ ] `src/components/features/audio/AudioPlayer.integration.test.tsx`: bỏ giả định native select/input cũ.
- [ ] `src/components/layout/header/SearchFlow.test.tsx`: cập nhật text loading đúng với component (`Đang lục tìm kho truyện...`).
- [ ] Chạy full test:
  - `npm test -- --run`

Done khi:
- Full test suite pass.

## Part 4 - Chuẩn hóa route đăng nhập (P1)

- [x] Chọn route canonical: `'/login'` hoặc `'/dang-nhap'`.
- [x] Đồng bộ ở:
  - `src/components/layout/header/MobileMenu.tsx`
  - `src/components/mobile/BottomNavigation.tsx`
- [x] Nếu route chưa tồn tại, tạo page route tương ứng hoặc redirect.

Done khi:
- Tất cả entry auth trên mobile đi cùng một route và không 404.

## Part 5 - Tối ưu API call thừa (P1)

- [x] `src/app/page.tsx`: tránh gọi `getHotStories` 2 lần.
  - Cân nhắc dùng chung dataset cho section hot + ranking transform.
- [x] `src/app/tim-kiem/page.tsx`: chỉ fetch ranking khi thực sự render sidebar, hoặc lazy/defer.
- [x] Verify SSR:
  - `npm run build`

Done khi:
- Giảm request backend không cần thiết, build vẫn pass.

## Part 6 - Dọn barrel exports dư (P2)

- [x] Xóa hoặc giữ có chủ đích các barrel không có consumer:
  - `src/components/features/index.ts`
  - `src/components/features/audio/index.ts`
  - `src/components/layout/index.ts`
  - `src/components/layout/header/index.ts`
- [x] Nếu giữ lại, thêm consumer thực sự hoặc comment rõ lý do.
- [ ] Chạy kiểm tra:
  - `npx ts-prune -p tsconfig.json`
  - `npm run lint`

Done khi:
- Không còn barrel dư gây nhiễu import graph.

## 4. Checklist merge cuối

- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm test -- --run`
- [ ] `npm run build`
- [ ] Không có route auth mâu thuẫn.
- [ ] Không còn API call thừa rõ ràng ở page SSR chính.

## 5. Gợi ý thứ tự làm nhanh

1. Part 1  
2. Part 2  
3. Part 3  
4. Part 4  
5. Part 5  
6. Part 6

