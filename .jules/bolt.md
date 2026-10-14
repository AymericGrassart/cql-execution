## 2025-02-21 - Immutable.Set uniqueness checking in toDistinctList
**Learning:** In Immutable.Set (mutable transient wrapper), calling `y.count()` before and after `y.add(key)` to determine if an insertion occurred recalculates the set count twice per item, creating significant O(N) overhead during distinct operations. Calling `!y.has(key)` checks membership in O(1) time without triggering set count calculations.
**Action:** Use `!y.has(key)` before adding items to Immutable.Set when constructing distinct lists or deduplicating elements.
