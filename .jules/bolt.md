## 2025-02-18 - Object class extraction in comparison utilities
**Learning:** `getClassOfObjects` was calling `[object1, object2].map(obj => ({}.toString.call(obj)))` on every non-primitive comparison in `equals` and `equivalent`. Creating new literal objects `{}` and calling `.map()` with closure functions on every comparison caused massive allocation overhead (~24x slower in object equality benchmarks).
**Action:** Always cache `Object.prototype.toString` at module level and return tuple arrays directly without `.map()` or inline closures.
