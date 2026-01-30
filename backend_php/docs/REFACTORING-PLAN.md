# Refactoring Implementation Plan

**Goal:** Address critical issues identified in the Code Review (30/01/2026), focusing on reducing duplication, improving maintainability, and standardizing error handling.

## User Review Required
> [!IMPORTANT]
> The **Service Container** implementation (Step 1) is a major architectural change. It will involve modifying all Controllers/Services to use Dependency Injection via the container. This breaks the current pattern of `new Class()` inside constructors.

## Proposed Changes

### P0: Logging & Monitoring
**Goal:** Implement a simple, dependency-free Logger to track application events and errors.

#### [NEW] [Logger.php](file:///d:/Web-clone/backend_php/lib/Logger/Logger.php)
- Class `Lib\Logger\Logger`
- Methods: `info($msg, $ctx)`, `error($msg, $ctx)`, `log($level, $msg, $ctx)`
- Writes to `logs/app-{date}.log`
- Handles directory creation.

#### [MODIFY] [ServiceContainer.php](file:///d:/Web-clone/backend_php/lib/Container/ServiceContainer.php)
- Register `Lib\Logger\Logger` as a singleton service.

#### [MODIFY] [ErrorHandler.php](file:///d:/Web-clone/backend_php/lib/ErrorHandler/ErrorHandler.php)
- **Inject Logger** (or fetch from Container) to log `internalError` and `handleDatabaseError`.
- **Change:** Log detailed error message before hiding it from user.

#### [MODIFY] [AuthController.php](file:///d:/Web-clone/backend_php/app/Controllers/AuthController.php)
- Inject `Logger`.
- Log: "User login success: {email}", "User login failed: {email}".

## Verification Plan

### Manual Verification
- **Login Action**:
  - Perform Login.
  - Check `logs/app-{date}.log`.
  - Expect line: `[2026-01-30 10:00:00] [INFO] User login success: ...`
- **Error Trigger**:
  - Malform DB query (temporary).
  - Check log for detailed PDO Exception.

