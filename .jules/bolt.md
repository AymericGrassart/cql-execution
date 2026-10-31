# Bolt's Performance Journal

## 2025-02-17 - Avoid Array.prototype.shift in merge routine of asyncMergeSort
**Learning:** `asyncMergeSort` was using `Array.prototype.shift()` in its `merge()` helper loop to consume items from `left` and `right`. Because `shift()` is O(k) per removal in JavaScript arrays, merging two arrays of size `k` incurred O(k^2) shifting operations.
**Action:** Use two running index pointers (`leftIndex`, `rightIndex`) instead of `shift()` to achieve true O(k) merge operations and avoid unnecessary array copies and re-indexing.
