## 2025-05-18 - Avoid array allocation and .every() closures in recursive equality functions

**Learning:** `src/util/comparison.ts` functions (`equals`, `equivalent`, `deepCompareKeysAndValues`) are invoked heavily across query evaluations and filtering operations. Allocating arrays/maps like `[a, b].map(...)` or calling `aKeys.every(...)` creates significant garbage collection and function call overhead. Checking key lengths before sorting keys avoids unnecessary sorting operations when objects have different key counts.
**Action:** Prefer direct `for` loops, early length comparisons before array sorts, and direct `typeof x === 'function'` checks in high-frequency comparison utilities.
