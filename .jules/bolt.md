## 2025-02-18 - Optimized Comparison Utilities in cql-execution

**Learning:** `equals` and `equivalent` in `src/util/comparison.ts` are called heavily throughout CQL expression evaluations. `getClassOfObjects` was creating temporary arrays `[a, b]` and mapping over them to get class names, while `getKeysFromObject` used `isFunction` which invoked `Object.prototype.toString.call` for every property. Replacing `getClassOfObjects` with direct `typeof` and `Object.prototype.toString.call` checks eliminates intermediate allocations.
**Edge Case:** In CQL list equality, `a.indexOf(null)` / `a.indexOf(undefined)` must be evaluated before comparing array lengths, because CQL specifies three-valued logic where `[1, null]` compared to `[1, 2, 3]` returns `null`, not `false`.
**Action:** Use fast `typeof` guards before `Object.prototype.toString.call`, avoid array allocations in utility functions, and preserve three-valued logic for lists with nulls.
