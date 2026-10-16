## 2025-05-18 - Avoid Array.prototype.shift() in Custom Merge Sort Implementations
**Learning:** `asyncMergeSort` in `src/util/util.ts` used `left.shift()` and `right.shift()` inside the merge loop. Because `Array.prototype.shift()` re-indexes all remaining array elements on every call (O(N)), the merge phase ran in O(N²) time rather than O(N), making overall sort complexity O(N² log N).
**Action:** Always use index pointers (`let i = 0, j = 0`) when merging sorted arrays in custom sort routines to maintain O(N) linear merge performance and O(N log N) total time complexity.
