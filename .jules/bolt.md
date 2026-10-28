## 2025-02-21 - Avoid `Array.prototype.shift()` in `asyncMergeSort`

**Learning:** `asyncMergeSort` was using `left.shift()` and `right.shift()` inside the merge step loop. Calling `Array.prototype.shift()` on an array of length $N$ is an $O(N)$ operation because it re-indexes all remaining elements. Doing this inside the merge loop turned the merge phase into $O(N^2)$ per level ($O(N^2 \log N)$ total time for sorting).
**Action:** Use index pointers (`i` and `j`) to iterate through `left` and `right` arrays without mutating or re-indexing them in merge algorithms.
