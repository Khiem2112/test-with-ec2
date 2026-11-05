---
name: typescript-convention
description: >
  Pure TypeScript coding standards, type-safety rules, commenting guidelines, and architectural boundaries. Covers types vs interfaces, no any, explicit returns, naming conventions, immutability, barrel imports, nullish coalescing, and pre-commit verification.
---

# TypeScript Coding Standards & Conventions

This skill defines pure TypeScript technical standards and type-safety rules extracted from the master harness. Domain business rules must not be placed here; refer to feature specifications and domain flow skills.

---

## 1. Types Over Interfaces
Always use `type` instead of `interface` for props, state, payloads, DTOs, and object shapes. Use `interface` only when mandatory for third-party library declaration merging.

```typescript
// HOP LE: Su dung type cho tat ca cac cau truc du lieu
type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
};

// KHONG HOP LE: Su dung interface cho du lieu noi bo
interface UserProfile {
  id: string;
  name: string;
  email: string;
}
```

---

## 2. No `any` — Use `unknown` + Type Guards
The `any` type is strictly forbidden. Use `unknown` for unverified data and narrow types using type guards, discriminated unions, or validation schemas (Zod).

```typescript
// HOP LE: Thu hep kieu du lieu tu unknown bang type guard
function parseApiResponse(data: unknown): UserProfile {
  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as Record<string, unknown>).id === "string" &&
    "name" in data &&
    typeof (data as Record<string, unknown>).name === "string" &&
    "email" in data &&
    typeof (data as Record<string, unknown>).email === "string"
  ) {
    return data as UserProfile;
  }
  throw new Error("Invalid payload structure received from upstream API");
}

// KHONG HOP LE: Su dung any bo qua kiem tra kieu tinh
function parseApiResponse(data: any): any {
  return data;
}
```

---

## 3. Explicit Return Types for Functions & Services
Always provide explicit return types on all exported functions, services, controllers, server actions, and API handlers. This prevents accidental type widening and unintended breaking changes in public contracts.

```typescript
// HOP LE: Khai bao ro rang kieu tra ve cho ham public
export async function calculateMetrics(userId: string): Promise<UserMetricsResult> {
  const profile = await fetchUserProfile(userId);
  return computeAggregates(profile);
}

// KHONG HOP LE: De trinh bien dich tu suy dien kieu tra ve
export async function calculateMetrics(userId: string) {
  const profile = await fetchUserProfile(userId);
  return computeAggregates(profile);
}
```

---

## 4. Naming Conventions
- **PascalCase**: Types, Enums, Classes, and Component files (`CustomerOrder`, `SyncBatchStatus`, `UserCard.tsx`).
- **camelCase**: Variables, functions, hook files, service methods, and controller actions (`getUserById`, `calculatePrice`, `userService.ts`).
- **UPPER_CASE**: Module-level constants, configuration values, and immutable magic numbers (`MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE`, `PHONE_REGEX`).

```typescript
// HOP LE: Dat ten nhat quan theo quy uoc
const MAX_TIMEOUT_MS = 5000;
type OrderFilter = { status: string };
function fetchOrderList(): void {}
```

---

## 5. Immutability & Spread Operations
Never mutate arrays or objects directly in-place. Use spread syntax or immutable array operations (`map`, `filter`, `reduce`). Do not use `Object.assign`.

```typescript
// HOP LE: Tao doi tuong va mang moi bang spread syntax
const updatedList = [...originalList, newItem];
const updatedRecord = { ...existingRecord, status: "active" as const };

// KHONG HOP LE: Thay doi truc tiep bo nho doi tuong hien tai
originalList.push(newItem);
Object.assign(existingRecord, { status: "active" });
```

---

## 6. Modular & Barrel Imports
Import types, utilities, and components through clean barrel files (`index.ts`) instead of deep internal directory paths.

```typescript
// HOP LE: Import thong qua barrel file
import { Customer, Order } from "@/types";
import { formatDate } from "@/utils";

// KHONG HOP LE: Import qua duong dan noi bo sau
import { Customer } from "@/types/subfolder/customer/model/Customer";
```

---

## 7. Nullish Coalescing & Optional Chaining
Use `??` (nullish coalescing) and `?.` (optional chaining) instead of `||` (logical OR) to avoid accidental bugs when handling falsy but valid values such as `0`, `""`, or `false`.

```typescript
// HOP LE: Su dung nullish coalescing de giu nguyen gia tri hop le bang 0 hoac rong
const displayCount = count ?? 0;
const userName = user?.profile?.name ?? "Guest";

// KHONG HOP LE: Su dung logical OR de bi loi khi count bang 0
const displayCount = count || 0;
```

---

## 8. Variable Declarations: No `var`
Always use `const` by default. Use `let` only when a variable must be reassigned. Never use `var`.

```typescript
// HOP LE: Dung const mac dinh va let khi can gan lai
const maxLimit = 100;
let currentIndex = 0;

// KHONG HOP LE: Khai bao bien bang var
var total = 0;
```

---

## 9. Commenting Guidelines: Descriptive Intent Comments
Adding comments to clarify domain intent, business rationale, safety boundaries, and complex algorithms is encouraged. However, positional step numbering and trivial syntax restatements are prohibited.

- **Purpose & Intent Comments**: Write concise comments above logical blocks explaining what domain goal is accomplished and why specific logic exists.
- **Prohibited - Positional Markers**: Never prefix comments with step numbers or positional chains (such as `// 1. ...`, `// Step X`, `// Buoc 1`).
- **Prohibited - Trivial Restatements**: Never write comments that merely restate obvious syntax (such as `// Call function`, `// Check regex`, `// Return value`).

```typescript
// KHONG HOP LE: Chu thich so thu tu va lap lai cu phap
// 1. Check phone regex
if (PHONE_REGEX.test(text)) {
  // 2. Call service
  notifyUser(text);
}

// HOP LE: Giai thich y nghia nghiep vu va dong co xu ly
// Validate text against sensitive PII exposure patterns before queuing notification
if (PHONE_REGEX.test(text)) {
  notifyUser(text);
}
```

Detailed reference: [examples/commenting_guidelines.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/.agents/skills/typescript/examples/commenting_guidelines.md).

---

## 10. Persistence & DTO Derivation Standards
To prevent type drift between persistence schemas and application logic:
- Derive DTOs and query payloads from authoritative types using `Pick`, `Omit`, utility types, or `z.infer`.
- Never manually hand-copy full database model fields into a parallel DTO type.
- Never expose raw database entities containing sensitive internal fields (such as password hashes or audit secrets) to client responses; always project explicitly.

```typescript
// HOP LE: Trich xuat kieu DTO tu cau truc goc thong qua Pick va Omit
type UserSummaryDTO = Pick<UserProfile, "id" | "name" | "email">;

// KHONG HOP LE: Sao chep thu cong toan bo field tao ra nguy co sai lech khi schema thay doi
type UserSummaryDTO = {
  id: string;
  name: string;
  email: string;
};
```

---

## 11. Architectural Layering & Pure Utils Boundary
Maintain strict separation between architectural layers:
- **Controllers & Route Handlers (`src/controllers/`)**: Validate incoming request payloads (via Zod), format HTTP status codes, and handle exceptions.
- **Services (`src/services/`)**: Encapsulate all business logic, domain rules, and database transactions.
- **Pure Utils (`src/utils/`)**: Pure and stateless functions only. Must not perform database operations, invoke external APIs, or execute file I/O.
- Small 1 to 2 line private helpers should remain directly inside their caller service file; extract to `src/utils/` only when complex and reused across multiple features.

---

## 12. Mandatory Pre-Commit Typecheck & Lint Gate
Before staging, committing, or completing any TypeScript task:
- Run `npx tsc --noEmit` to verify zero compile-time type errors.
- Run `npm run check` to verify exit code 0 across static checks.
- Committing code with unresolved TypeScript compilation errors is strictly prohibited.
