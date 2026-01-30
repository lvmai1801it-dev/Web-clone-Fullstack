# 📅 KỂ HOẠCH CHI TIẾT SPRINT 4 & POST-MVP

**Cập nhật:** 30/01/2026  
**Trạng thái hiện tại:** Sprint 1-3 hoàn thành (100%), sẵn sàng Sprint 4  
**Tổng cộng:** ~80 giờ (Sprint 4 + P0 + Post-MVP Phase 1)

---

## ✅ SPRINT 1-3 ĐÃ HOÀN THÀNH (100%)

### **SPRINT 1: FOUNDATION & LOOKUP (14 tasks)**
- ✅ CC.1-CC.7: Global Exception, Response Formatter, Config, Logging
- ✅ CC.8: CORS Middleware
- ✅ CC.11: Health Check endpoint
- ✅ AU.1-AU.2: Authors CRUD
- ✅ CT.1-CT.2: Categories CRUD
- ✅ INF.1-INF.2: Docker + CI/CD base
- **Status:** Ready for production

### **SPRINT 2: STORIES SYSTEM (15 tasks)**
- ✅ DB.1-DB.4: Story Model, Migration, Relations, Repository
- ✅ VL.1-VL.4: Validation rules, Slug service
- ✅ SV.1-SV.6: StoryService (CRUD, filter, search, pagination)
- ✅ API.1-API.7: StoryController (all endpoints)
- ✅ Test infrastructure
- **Status:** All endpoints working with full features

### **SPRINT 3: CHAPTERS & AUTH (16 tasks)**
- ✅ CH.1-CH.8: Chapter Model, Service, Endpoints, Bulk import
- ✅ AUH.1-AUH.5: JWT, Register, Login, Profile endpoints
- ✅ USR.1-USR.4: User Model, CRUD, Roles, Admin Middleware
- ✅ RL.1: Story-User Relations
- ✅ MVP.1: Swagger/OpenAPI documentation
- **Status:** Auth system working, ready for user features

---

## 🚀 SPRINT 4: USER INTERACTION & MVP RELEASE (38 tasks, ~55 hours)

### **Phase 4.1: Comments System (7 tasks, 12 hours)**

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| CM.1 | Create comments table + schema | 1h | Not Started | Foreign keys, indexes, soft delete |
| CM.2 | Comment Model + fromArray() | 1h | Not Started | Relationships (story, author, replies) |
| CM.3 | CommentRepository CRUD | 2h | Not Started | create, update, delete, find, getStoryComments |
| CM.4 | CommentRepository nested replies | 1.5h | Not Started | getReplies, loadNestedTree |
| CM.5 | CommentService layer | 1.5h | Not Started | Business logic, ownership checks, validation |
| CM.6 | CommentController endpoints | 2h | Not Started | GET/POST/PUT/DELETE /stories/{id}/comments |
| CM.7 | Comment tests + admin moderation | 1.5h | Not Started | Unit & integration tests |

**Deliverables:** Comments system fully functional with nested replies & moderation

---

### **Phase 4.2: Reading Progress (5 tasks, 10 hours)**

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| RP.1 | Create reading_progress table | 1h | Not Started | Composite PK (user_id, story_id, chapter_id) |
| RP.2 | ReadingProgressRepository upsert | 1.5h | Not Started | INSERT...ON DUPLICATE KEY UPDATE logic |
| RP.3 | ReadingProgressService | 1.5h | Not Started | updateProgress, getStatus, getHistory |
| RP.4 | Progress API endpoints | 1.5h | Not Started | POST/GET /reading-progress endpoints |
| RP.5 | Bulk progress update endpoint | 1h | Not Started | POST /reading-progress/bulk |

**Deliverables:** Progress tracking with upsert logic, history view

---

### **Phase 4.3: Rating System (4 tasks, 8 hours)**

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| RT.1 | Create ratings table + schema | 1h | Not Started | 1-5 stars, unique constraint (user_id, story_id) |
| RT.2 | RatingRepository + stats | 1.5h | Not Started | CRUD, getRatingStats, getDistribution |
| RT.3 | RatingService + auto-update | 1.5h | Not Started | rateStory, updateStoryAverage |
| RT.4 | Rating API endpoints | 1.5h | Not Started | POST/GET/DELETE /stories/{id}/ratings |

**Deliverables:** 5-star rating system with average auto-calculation

---

### **Phase 4.4: MVP Polish & Deployment (8 tasks, 16 hours)**

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| MVP.1 | Complete Swagger docs | 2h | Not Started | All endpoints documented, examples, auth |
| MVP.2 | Postman collection + env vars | 1.5h | Not Started | Dev/staging/prod environments |
| MVP.3 | Deploy script (deploy.sh) | 2h | Not Started | Git pull, composer install, migrations |
| MVP.4 | Production env config | 1h | Not Started | .env.production, DB pool, JWT secret |
| MVP.5 | Staging env config | 1h | Not Started | .env.staging, mirror production |
| MVP.6 | Development env setup | 1h | Not Started | .env.example, docker-compose |
| MVP.7 | Load testing script (k6) | 2h | Not Started | Basic load test, P95 < 500ms |
| MVP.8 | Performance review + optimization | 2h | Not Started | Query optimization, cache headers |

**Deliverables:** Production-ready deployment, full documentation

---

### **Phase 4.5: Final Testing & QA (4 tasks, 9 hours)**

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| QA.1 | Integration tests comments + progress | 2h | Not Started | Test all CRUD operations |
| QA.2 | Integration tests ratings | 1h | Not Started | Rating creation, update average |
| QA.3 | End-to-end user flows | 2h | Not Started | Register → Comment → Rate → Progress |
| QA.4 | Security audit + fix | 2h | Not Started | SQL injection, XSS, auth bypass |
| QA.5 | Performance profiling | 1h | Not Started | Response times, DB queries, memory |
| QA.6 | Bug fix + UAT | 1h | Not Started | Fix critical issues from testing |

**Deliverables:** MVP ready for production release

---

## 🔴 P0: CRITICAL FIXES BEFORE MVP (6 tasks, ~14 hours)

**⚠️ MUST FIX:** Phải làm SONG SONG với Sprint 4, hoàn thành trước go-live

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| P0.1 | Implement logout endpoint | 1h | Not Started | POST /auth/logout, token blacklist |
| P0.2 | Add AuthMiddleware to protected routes | 1h | Not Started | Verify JWT token, set user context |
| P0.3 | Implement AdminMiddleware | 1h | Not Started | Check role = 'admin', throw 403 if not |
| P0.4 | Add security headers middleware | 0.5h | Not Started | HSTS, X-Frame-Options, CSP headers |
| P0.5 | Standardize error response format | 2h | Not Started | Unified error format across all endpoints |
| P0.6 | Implement rate limiting middleware | 2h | Not Started | 60 req/min per IP, Redis-backed |
| P0.7 | Test all P0 fixes | 1.5h | Not Started | Unit + integration tests for security |

**Deliverables:** All security & blocking issues resolved

---

## 🟢 POST-MVP PHASE 1: Quick Wins (Phase 5-6 Start, ~20 hours)

**Có thể bắt đầu sau MVP release, không blocking MVP**

### **Phase 5: S3 File Upload (5 tasks, 12 hours)**

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| UP.1 | AWS S3 credentials + SDK setup | 1h | Not Started | Install AWS SDK, configure credentials |
| UP.2 | S3 file upload endpoint | 1.5h | Not Started | POST /upload (presigned URL) |
| UP.3 | File validation service | 1h | Not Started | Type, size, virus scan |
| UP.4 | Async job queue setup | 1.5h | Not Started | Redis queue or Beanstalkd |
| UP.5 | Upload processing + tests | 1.5h | Not Started | Process uploaded files, store references |

**Deliverables:** Basic file upload to S3 working

### **Phase 6: Redis Caching (3 tasks, 8 hours)**

| # | Task | Estimate | Status | Notes |
|---|------|----------|--------|-------|
| CACHE.1 | Redis connection setup | 1h | Not Started | Configure Redis client, connection pooling |
| CACHE.2 | Cache layer for stories list | 2h | Not Started | Cache GET /stories, invalidate on update |
| CACHE.3 | Cache layer for categories | 1h | Not Started | Cache categories, TTL 1 hour |
| CACHE.4 | Cache monitoring + hit rate | 2h | Not Started | Track cache hit rate, optimize TTL |

**Deliverables:** Caching layer reducing DB load by 60%+

---

## 📋 QUICK REFERENCE: CURRENT STATUS

### **By Phase**
| Phase | Total Tasks | Completed | In Progress | Not Started | Estimate |
|-------|------------|-----------|-------------|-------------|----------|
| Sprint 1-3 | 45 | 45 (100%) | - | - | ✅ Done |
| Sprint 4 | 38 | - | - | 38 | 55h |
| P0 Fixes | 7 | - | - | 7 | 14h |
| Post-MVP 1 | 8 | - | - | 8 | 20h |
| **TOTAL** | **98** | **45** | **-** | **53** | **89h** |

### **By Category**
| Category | Not Started | Estimate | Priority |
|----------|-----------|----------|----------|
| Comments | 7 tasks | 12h | P1 (MVP) |
| Reading Progress | 5 tasks | 10h | P1 (MVP) |
| Ratings | 4 tasks | 8h | P1 (MVP) |
| MVP Polish | 8 tasks | 16h | P1 (MVP) |
| Testing & QA | 6 tasks | 9h | P1 (MVP) |
| **P0 Critical Fixes** | **7 tasks** | **14h** | **P0 (BLOCKING)** |
| S3 Upload | 5 tasks | 12h | P2 (Post-MVP) |
| Redis Caching | 4 tasks | 8h | P2 (Post-MVP) |

---

## 🎯 RECOMMENDED ROADMAP

### **WEEK 1 (5 days)**
- **Mon-Wed:** CM.1-CM.5 (Comments core) + P0.1-P0.3 (Auth fixes)
- **Wed-Fri:** CM.6-CM.7 + RP.1-RP.2 (Comments API + Progress schema)
- **Parallel:** P0.4-P0.7 (Security fixes)
- **Estimate:** 20-22 hours of work

### **WEEK 2 (5 days)**
- **Mon-Tue:** RP.3-RP.5 (Progress endpoints + bulk)
- **Tue-Wed:** RT.1-RT.2 (Rating schema + repo)
- **Wed-Thu:** RT.3-RT.4 (Rating service + endpoints)
- **Thu-Fri:** MVP.1-MVP.3 (Docs, Postman, Deploy)
- **Estimate:** 19-21 hours of work

### **WEEK 3 (5 days)**
- **Mon-Tue:** MVP.4-MVP.8 (Config + Load testing)
- **Tue-Wed:** QA.1-QA.4 (Integration tests)
- **Wed-Thu:** QA.5-QA.6 (Performance + bug fix)
- **Thu-Fri:** Final UAT + go-live prep
- **Estimate:** 14-16 hours of work

### **📊 Total Sprint 4: 53-59 hours (8-9 days of work)**

**MVP Release Target:** End of Week 3 ✅

---

## 🚀 SPRINT 4 DEFINITION OF DONE (Checklist)

### **Before go-live:**
- [ ] All 38 Sprint 4 tasks completed
- [ ] All 7 P0 fixes implemented & tested
- [ ] Comments system: create, update, delete, nested replies
- [ ] Reading progress: save, history, bulk update
- [ ] Rating system: 1-5 stars, auto-average
- [ ] Swagger docs + Postman collection complete
- [ ] Deploy script tested on staging
- [ ] Load test passing (P95 < 500ms)
- [ ] Security audit passed (no critical issues)
- [ ] Test coverage > 80% (critical paths 100%)
- [ ] Zero P0 bugs in final testing
- [ ] Production environment ready
- [ ] Monitoring + alerting configured
- [ ] Rollback procedure documented
- [ ] Team sign-off + release notes ready

---

## 📈 POST-MVP PHASES (Future Planning)

### **Phase 6-7: Search & Advanced Features (3-4 weeks)**
- Full-text search indexing
- Admin dashboard analytics
- User moderation tools
- Bulk operations

### **Phase 8-9: Scaling & Real-time (4-5 weeks)**
- WebSocket notifications
- Advanced caching strategies
- Database replication
- Multi-language support

---

## 💡 NOTES & CONSTRAINTS

### **Assumptions:**
- 1 developer can handle 6-8 hours of real work per day
- Code review adds 10-15% time to each task
- Testing adds 20-30% time to development
- Database migrations should be tested before production

### **Risks:**
- **Comment nesting complexity:** Might take longer if N+1 queries issues arise
- **Rate limiting:** Redis setup dependency, need Redis infrastructure
- **Load testing:** Might reveal performance bottlenecks requiring optimization
- **Security fixes:** P0 items might uncover additional issues during testing

### **Contingency:**
- Add 20% buffer (10 hours) for unexpected issues
- **Realistic Timeline:** 65-75 hours (10-12 days with 1 dev)

---

> **Status:** READY FOR SPRINT 4 EXECUTION  
> **Go-Live Target:** End of Week 3 (February 20, 2026)  
> **Team Capacity:** 1-2 devs recommended for 2-week delivery
