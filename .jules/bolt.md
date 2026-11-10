# Bolt's Journal

## 2024-11-10 - O(n) Array Shift in Async Sorting and Interval Merging
**Learning:** `Array.prototype.shift()` in iterative merging loops causes accidental $O(n^2)$ behavior due to repeated $O(n)$ element re-indexing and array reallocation on every iteration.
**Action:** In array merge and collapse operations, prefer two-pointer index iteration over modifying arrays with `shift()`.
