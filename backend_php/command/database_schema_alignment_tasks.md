# 🔧 Database Schema vs DTOs Alignment Tasks

## 🎯 **Overview**
**Mục tiêu:** Align tất cả DTOs và interfaces với actual database schema từ `schema_content.sql`
**Trạng thái hiện tại:** Multiple mismatches giữa DB và DTOs gây potential runtime errors

---

## 📊 **Database Schema Analysis**

### **Tables & Fields Summary**
```sql
STORIES: id, title, slug, cover_url, narrator, description, status, total_chapters, views, rating_avg, rating_count, created_at, updated_at, author_id
CATEGORIES: id, name, slug
AUTHORS: id, name, slug  
CHAPTERS: id, number, title, audio_url, duration_sec, created_at, story_id
TAGS: id, name, slug, description
USERS: id, username, email, password, avatar, role, created_at, updated_at, full_name, deleted_at
```

---

## 🚨 **CRITICAL ISSUES (Will Cause Runtime Errors)**

### **1. StoryDto - Field Mismatches**
```php
// ❌ PROBLEMS HIỆN TẠI:
public readonly ?int $rating_avg,        // Type mismatch - should be float/decimal
public readonly int $rating_count,         // ✅ CORRECT
// ❌ MISSING FIELDS:
- narrator (varchar(191))              // Thiếu trong DTO
- views (int)                        // Thiếu trong DTO  
- rating_avg should be float not int     // Type sai
- created_at (datetime)                 // Thiếu trong DTO
- updated_at (datetime)                 // Thiếu trong DTO
```

### **2. ChapterDto - Critical Issues**
```php
// ❌ PROBLEMS NGHIÊM TRỌNG:
public readonly ?int $duration,           // DB field là 'duration_sec'
public readonly ?string $content,         // DB không có 'content' field
// ❌ MISSING FIELDS:  
- created_at (datetime)                 // Thiếu trong DTO
```

### **3. CategoryDto - Missing Field**
```php
// ❌ PROBLEM:
// Database có 'description' field nhưng DTO không có
public readonly ?string $description       // ❌ MISSING!
```

### **4. AuthorDto - Field Mapping**
```php
// ❌ PROBLEM:
public readonly ?string $bio               // DB không có 'bio' field
// Database chỉ có: id, name, slug
```

### **5. UserDto - Multiple Issues**
```php
// ❌ PROBLEMS:
// Database fields không có trong DTO:
- avatar (varchar(500))                  // ❌ MISSING
- created_at (datetime)                 // ❌ MISSING  
- updated_at (datetime)                 // ❌ MISSING
- deleted_at (timestamp)                  // ❌ MISSING

// ❌ INCORRECT TYPE:
public readonly ?string $password          // Should not be in DTO output
```

### **6. TagDto - Missing Fields**
```php
// ❌ PROBLEM:
// Database có 'description' field nhưng DTO không có
public readonly ?string $description       // ❌ MISSING!
```

---

## 📋 **Detailed Fix Tasks**

### **PHASE 1: StoryDto Fixes (15 phút)**

#### **File:** `app/DTOs/StoryDto.php`

**Tasks:**
- [ ] **Add missing fields:**
  ```php
  public readonly ?string $narrator,
  public readonly int $views,
  public readonly float $rating_avg,
  public readonly string $created_at,
  public readonly string $updated_at,
  ```

- [ ] **Fix type mismatch:**
  ```php
  // CHANGE FROM:
  public readonly ?int $rating_avg,
  // TO:
  public readonly float $rating_avg,
  ```

- [ ] **Update fromArray() method:**
  ```php
  narrator: $data['narrator'] ?? null,
  views: (int) ($data['views'] ?? 0),
  rating_avg: (float) ($data['rating_avg'] ?? 0.0),
  created_at: isset($data['created_at']) ? (string) $data['created_at'] : null,
  updated_at: isset($data['updated_at']) ? (string) $data['updated_at'] : null,
  ```

- [ ] **Update toArray() method:**
  ```php
  'narrator' => $this->narrator,
  'views' => $this->views,
  'rating_avg' => $this->rating_avg,
  'created_at' => $this->created_at,
  'updated_at' => $this->updated_at,
  ```

### **PHASE 2: ChapterDto Fixes (10 phút)**

#### **File:** `app/DTOs/ChapterDto.php`

**Tasks:**
- [ ] **Fix field name mismatch:**
  ```php
  // CHANGE FROM:
  public readonly ?int $duration,
  // TO:
  public readonly ?int $duration_sec,
  ```

- [ ] **Remove non-existent field:**
  ```php
  // REMOVE:
  public readonly ?string $content,     // DB không có field này
  ```

- [ ] **Add missing field:**
  ```php
  public readonly string $created_at,
  ```

- [ ] **Update fromArray() và toArray() methods:**
  ```php
  duration_sec: isset($data['duration_sec']) ? (int) $data['duration_sec'] : null,
  created_at: (string) ($data['created_at'] ?? ''),
  // REMOVE content field hoàn toàn
  ```

### **PHASE 3: CategoryDto Fix (5 phút)**

#### **File:** `app/DTOs/CategoryDto.php`

**Tasks:**
- [ ] **Add missing field:**
  ```php
  public readonly ?string $description,
  ```

- [ ] **Update methods:**
  ```php
  description: isset($data['description']) ? (string) $data['description'] : null,
  'description' => $this->description,
  ```

### **PHASE 4: AuthorDto Fix (5 phút)**

#### **File:** `app/DTOs/AuthorDto.php`

**Tasks:**
- [ ] **Remove non-existent field:**
  ```php
  // REMOVE:
  public readonly ?string $bio,          // DB không có 'bio' field
  ```

- [ ] **Update methods:** Remove bio from fromArray() và toArray()

### **PHASE 5: UserDto Complete Rewrite (20 phút)**

#### **File:** `app/DTOs/UserDto.php`

**Tasks:**
- [ ] **Add missing fields:**
  ```php
  public readonly ?string $avatar,
  public readonly string $created_at,
  public readonly string $updated_at,
  public readonly ?string $deleted_at,
  ```

- [ ] **Remove password field from public output:**
  ```php
  // Keep password field for internal use only:
  private readonly ?string $password = null;   // Internal use
  ```

- [ ] **Update fromArray() method:**
  ```php
  avatar: isset($data['avatar']) ? (string) $data['avatar'] : null,
  created_at: (string) ($data['created_at'] ?? ''),
  updated_at: (string) ($data['updated_at'] ?? ''),
  deleted_at: isset($data['deleted_at']) ? (string) $data['deleted_at'] : null,
  // REMOVE password from toArray()
  ```

- [ ] **Update toArray() method:** Remove password from output, add new fields

- [ ] **Update jsonSerialize() method:** Ensure password excluded

### **PHASE 6: TagDto Fix (5 phút)**

#### **File:** `app/DTOs/TagDto.php`

**Tasks:**
- [ ] **Add missing field:**
  ```php
  public readonly ?string $description,
  ```

- [ ] **Update methods:**
  ```php
  description: isset($data['description']) ? (string) $data['description'] : null,
  'description' => $this->description,
  ```

---

## 🔧 **Repository Updates (30 phút)**

### **PHASE 7: StoryRepository Updates**
**File:** `app/Repositories/StoryRepository.php`

**Tasks:**
- [ ] **Update SQL queries để include new fields:**
  ```sql
  -- Thêm vào SELECT:
  SELECT s.*, narrator, views, rating_avg, created_at, updated_at
  ```
- [ ] **Update fromArray() calls để handle new fields**

### **PHASE 8: ChapterRepository Updates**
**File:** `app/Repositories/ChapterRepository.php`

**Tasks:**
- [ ] **Fix SQL field name:**
  ```sql
  -- Đổi 'duration' thành 'duration_sec':
  SELECT c.*, duration_sec, created_at
  ```

- [ ] **Remove content field từ queries**

### **PHASE 9: CategoryRepository Updates**
**File:** `app/Repositories/CategoryRepository.php`

**Tasks:**
- [ ] **Add description field to SQL queries:**
  ```sql
  -- Thêm vào SELECT:
  SELECT c.id, c.name, c.slug, c.description
  ```

- [ ] **Update fromArray() calls**

### **PHASE 10: AuthorRepository Updates**
**File:** `app/Repositories/AuthorRepository.php`

**Tasks:**
- [ ] **Remove bio field từ SQL queries**
- [ ] **Update fromArray() calls**

### **PHASE 11: UserRepository Updates**
**File:** `app/Repositories/UserRepository.php`

**Tasks:**
- [ ] **Add new fields to SQL queries:**
  ```sql
  -- Thêm vào SELECT:
  SELECT u.*, avatar, created_at, updated_at, deleted_at
  ```

- [ ] **Update fromArray() calls với new fields**

---

## 🧪 **Validation Tasks (15 phút)**

### **PHASE 12: Update Validation Logic**
**Files cần update:** Các DTO classes với validate() methods

**Tasks:**
- [ ] **Story validation:** Add narrator, views validation
- [ ] **Chapter validation:** Fix duration validation
- [ ] **Category validation:** Add description validation
- [ ] **User validation:** Add avatar, deleted_at validation
- [ ] **Tag validation:** Add description validation

### **PHASE 13: Update Services**
**Files cần update:** Services sử dụng các DTOs

**Tasks:**
- [ ] **StoryService:** Handle new fields trong business logic
- [ ] **ChapterService:** Fix duration handling
- [ ] **AuthService:** Handle new User fields
- [ ] **CategoryService:** Handle description field
- [ ] **AuthorService:** Remove bio handling

---

## 📝 **Testing Tasks (20 phút)**

### **PHASE 14: Create Test Cases**

**Tasks:**
- [ ] **Unit tests cho new DTO fields:**
  - Test StoryDto với narrator field
  - Test ChapterDto duration_sec mapping
  - Test CategoryDto description field
  - Test UserDto avatar/timestamp fields

- [ ] **Integration tests cho repositories:**
  - Test database queries include new fields
  - Test fromArray() conversion with new data

- [ ] **API endpoint tests:**
  - Test responses include new fields
  - Test validation handles new fields correctly

---

## 📊 **Success Metrics**

### **After Fix Completion:**
- ✅ **100% Field Alignment** - Tất cả DTO fields match database schema
- ✅ **Type Safety** - All field types correct (int, string, datetime, etc.)
- ✅ **Data Consistency** - No missing or extra fields
- ✅ **Runtime Stability** - No mapping errors
- ✅ **Validation Coverage** - All fields validated properly

### **Verification Checklist:**
- [ ] StoryDto matches 100% với stories table
- [ ] ChapterDto matches 100% với chapters table  
- [ ] CategoryDto matches 100% với categories table
- [ ] AuthorDto matches 100% với authors table
- [ ] UserDto matches 100% với users table
- [ ] TagDto matches 100% với tags table
- [ ] All repositories query correct fields
- [ ] All validation rules updated
- [ ] All tests pass

---

## 🎯 **Implementation Priority**

### **🔴 CRITICAL (Must Fix First)**
1. **StoryDto type fixes** - rating_avg type mismatch
2. **ChapterDto field name** - duration vs duration_sec
3. **UserDto missing fields** - avatar, timestamps
4. **Missing database fields** - description trong Category/Tag

### **🟡 HIGH (Fix Next)**
1. **Repository query updates** - Include missing fields
2. **Service logic updates** - Handle new fields
3. **Method updates** - fromArray() và toArray()

### **🟢 MEDIUM (Final Polish)**
1. **Validation updates** - Add rules for new fields
2. **Test coverage** - Comprehensive testing
3. **Documentation updates** - Update API docs

---

## 📈 **Timeline Estimate**

| Phase | Duration | Priority |
|--------|----------|----------|
| DTO Fixes (Phases 1-6) | 60 phút | 🔴 CRITICAL |
| Repository Updates (7-11) | 30 phút | 🟡 HIGH |
| Validation Updates (12-13) | 15 phút | 🟡 HIGH |
| Testing (14) | 20 phút | 🟢 MEDIUM |
| **TOTAL** | **125 phút** | **2+ giờ** |

---

## 🚨 **Runtime Error Prevention**

Fixing these issues will prevent:
- **Type mismatch errors** (rating_avg string vs decimal)
- **Property access errors** (duration vs duration_sec)
- **Missing property errors** (narrator, views, etc.)
- **Database field errors** (SELECT non-existent fields)
- **Serialization errors** (password in JSON output)

---

**⚠️ CRITICAL:** Fix these issues BEFORE implementing new RESTful APIs to avoid fundamental data mapping problems!

---

*Created: 2026-01-30*
*Based on: schema_content.sql analysis*
*Priority: Critical fixes before API development*
*Total Estimated Time: 2+ hours*