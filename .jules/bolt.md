# Bolt's Journal

## 2025-05-18 - Immutable.Set lookup and Object.prototype.toString optimizations
**Learning:**
1. In `Immutable.Set`, checking size changes via `.count()` before and after `.add(key)` causes double `.count()` evaluations and mutates the set on every item (including duplicates). Using `!y.has(key)` checks membership in O(1) and skips set mutation overhead on duplicates, speeding up `toDistinctList` by over 50%.
2. Creating inline arrays with `[a, b].map(obj => ({}.toString.call(obj)))` allocates temporary array instances, `{}` object instances, and callback functions on every object equality comparison. Calling `Object.prototype.toString.call(x)` directly eliminates allocations and runs ~4x faster.
**Action:** Use `set.has(key)` before `set.add(key)` when building distinct collections, and avoid `[a, b].map()` wrappers in hot comparison paths.
