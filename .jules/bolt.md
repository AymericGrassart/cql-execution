# Bolt's Journal - Critical Learnings

## 2025-05-14 - Avoid Array.shift() in asyncMergeSort merge step
**Learning:** In TypeScript/JavaScript merge sort implementations (`asyncMergeSort` in `src/util/util.ts`), consuming elements using `Array.prototype.shift()` introduces an $O(n)$ element re-indexing overhead on every iteration inside `while (left.length > 0 && right.length > 0)`, creating quadratic $O(n^2)$ behavior for the merge step as sub-arrays grow.
**Action:** Always prefer two-pointer indexing (`leftIdx` and `rightIdx`) when merging sorted arrays, avoiding mutating the array heads and eliminating $O(n)$ shifts.
