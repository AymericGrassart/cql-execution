## 2026-03-31 - Direct Prototype Call in Comparison Utility
**Learning:** In hot comparison code paths like `equals` and `equivalent`, helper functions like `getClassOfObjects` that create intermediate arrays `[a, b]` and invoke `.map(obj => ({}.toString.call(obj)))` create significant GC pressure and overhead due to array and closure allocations.
**Action:** Use direct array literals with `Object.prototype.toString.call(obj)` instead of `.map()` or `{}.toString.call()`.
