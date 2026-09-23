## 2025-02-17 - Immutable.Set size checks in toDistinctList & Array flattening

**Learning:** In `toDistinctList`, checking `y.count()` twice per element on an Immutable.Set to detect new additions adds significant tree traversal overhead. Using `!y.has(key)` checks membership directly before adding. Additionally, replacing `Array.prototype.reduce` with `concat` in `Flatten` with `Array.prototype.flat(1)` replaces O(N^2) array copy operations with O(N) flattening.
**Action:** Use `set.has(key)` before `set.add(key)` when building distinct lists with Immutable.js, and use `flat(1)` for flattening arrays.
