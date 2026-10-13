## 2025-02-18 - Fast-path primitive equality and allocation-free object comparisons in CQL comparison utilities

**Learning:** `equals` and `equivalent` in `src/util/comparison.ts` are called millions of times during CQL expression evaluation. Inline object creation like `{}.toString.call(obj)`, `.map()`, `.filter()`, and `.every()` in comparison helpers created significant garbage collection overhead and redundant property checks for primitives.

**Action:**
1. Check `typeof a === typeof b` for primitive types (number, boolean, string for `equals`) early to short-circuit before checking class/methods. Note: string equivalence in CQL is case-insensitive so strings are excluded from primitive fast-path in `equivalent`.
2. Cache `Object.prototype.toString` at module level rather than using `{}.toString.call(...)`.
3. Use simple `for` loops in `compareEveryItemInArrays`, `getKeysFromObject`, and `deepCompareKeysAndValues` to eliminate closure allocation per comparison and early-exit on length mismatches or key discrepancies.
