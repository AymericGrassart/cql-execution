# Bolt's Journal

## 2025-05-18 - Replacing Array `reduce(concat)` with native `flat(1)`
**Learning:** `arr.reduce((x, y) => x.concat(y), [])` creates new intermediate array allocations on every step, leading to O(N^2) time complexity and severe GC pressure as the number of inner arrays grows. In modern JS/TS runtimes, native `arr.flat(1)` executes in linear O(N) time with direct memory allocation.
**Action:** Replace `reduce((x, y) => x.concat(y), [])` patterns across list manipulation routines with `flat(1)`.
