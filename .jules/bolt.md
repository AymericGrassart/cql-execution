# Bolt's Journal - Critical Learnings

## 2025-02-18 - Avoid Array.prototype.shift() in Sorting and Queue Algorithms
**Learning:** In V8 / Node.js, `Array.prototype.shift()` has $O(k)$ time complexity because every remaining element in the array must be shifted in the backing memory buffer. In recursive divide-and-conquer algorithms like `asyncMergeSort` (used by CQL ELM query sort clauses), repeatedly calling `shift()` on the merge halves creates quadratic $O(n^2)$ copying overhead during each merge step and triggers unnecessary GC churn.
**Action:** Always prefer two-pointer index scanning (`i`, `j`) over mutating arrays with `.shift()` when merging or processing collections sequentially.
