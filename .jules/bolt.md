# Bolt's Journal - Critical Performance Learnings

## 2025-02-20 - Hot-path Object and Array Comparisons in CQL Execution

**Learning:** `src/util/comparison.ts` (`equals` and `equivalent`) is called millions of times during CQL evaluation. Allocating temporary arrays (e.g. `[a, b]`, `Object.keys().sort()`, `.indexOf(null)`), closures (`.every()`, `.filter()`), and accessing `{}.toString` creates significant GC pressure and execution overhead. Replacing helper array allocations and `.every()` closures with cached `Object.prototype.toString`, $O(N)$ `hasOwnProperty` checks, and `for` loops resulted in ~25% speed improvement across benchmarked comparison operations.

**Action:** When working on comparison logic or frequent evaluation helpers, avoid array/closure allocations on hot paths and preserve precision/uncertainty delegate checks before primitive fast paths.
