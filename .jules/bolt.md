## 2025-09-27 - O(N) Array shift anti-pattern in asyncMergeSort
**Learning:** `Array.prototype.shift()` in `asyncMergeSort`'s `merge` function re-indexes all elements on every iteration ($O(N)$), turning linear array merging into an $O(N^2)$ bottleneck (~1160ms for 100k items).
**Action:** Use pre-allocated arrays and two-pointer index tracking (`i`, `j`, `k`) for merge loops to achieve true $O(N)$ merge performance (~250ms for 100k items).
