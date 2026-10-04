# Bolt's Journal

## 2025-05-18 - Avoid O(N^2) Operations in `toDistinctList` and `asyncMergeSort`
**Learning:** Calling `y.count()` on a mutable `Immutable.Set` iterates elements to compute set size rather than doing an O(1) check. Repeatedly calling `y.count()` before and after `y.add()` in a loop results in O(N^2) complexity. Using `!y.has(key)` checks key presence in O(1) time. Similarly, using `.shift()` inside array merges causes O(N) re-indexing per item, whereas index pointers (`i`, `j`) operate in O(1) time.
**Action:** Always prefer `Set.has(key)` over comparing Set size before and after insertion, and use index pointers instead of `.shift()` when merging sorted arrays.
