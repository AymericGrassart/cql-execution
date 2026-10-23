## 2025-05-10 - O(N^2) Array Shift in asyncMergeSort
**Learning:** Calling `Array.prototype.shift()` inside a merge loop re-indexes array elements on every element processed (O(N) operation per element), degrading `asyncMergeSort` merge phase from O(N) to O(N^2).
**Action:** Always use index pointers (`i`, `j`) when merging or traversing arrays in iterative algorithms instead of `shift()`.
