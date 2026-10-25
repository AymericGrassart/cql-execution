## 2025-05-18 - Avoid Array Allocation & Closure Creation in Frequency Utility Hot-paths

**Learning:** `getClassOfObjects` was allocating arrays and running `.map(...)` on every call to `equals` and `equivalent`. Furthermore, `deepCompareKeysAndValues` sorted keys before verifying if key counts matched, and used `.every()` closures for array comparisons.
**Action:** Directly call `Object.prototype.toString.call(obj)`, check array length prior to sorting key arrays, and replace closure callbacks with direct `for` loops in utility methods.
