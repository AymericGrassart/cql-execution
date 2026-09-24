## 2025-05-18 - Avoid Quadratic Array Copying with Array.prototype.flat()
**Learning:** Using `reduce((acc, curr) => acc.concat(curr), [])` in JavaScript copies the accumulated array on every iteration, leading to $O(N^2)$ time complexity. In `cql-execution`, `Flatten.exec()` suffered from this when flattening nested lists. `Array.prototype.flat()` executes in $O(N)$ linear time and is >97% faster.
**Action:** Always prefer native `.flat()` over `.reduce((acc, curr) => acc.concat(curr), [])` for flattening array of arrays.
