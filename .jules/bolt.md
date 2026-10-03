## 2025-03-08 - Comparison Hot Path Optimization

**Learning:** Object and array comparisons (`equals` and `equivalent`) in CQL execution are called millions of times during list filtering, joins, and distinct operations. Using `{}.toString.call(...)`, `[a, b].map(...)`, and `Array.prototype.every` inside comparison hot paths creates massive object/array/closure allocations (~10.8s for 1M object comparisons). In addition, key order sorting in 3-valued logic comparison (`true`, `false`, `null`) is critical for deterministic evaluation.

**Action:** Cache `Object.prototype.toString`, use direct property calls, and replace array iteration methods (`.every()`, `.filter()`) with standard `for` loops in hot path comparison functions.
