## 2025-02-14 - Immutable.Set deduplication anti-pattern in `toDistinctList`
**Learning:** Checking Set size increases via `set.count()` calls twice per item during insertion (`y.add(key); if (y.count() > setSize)`) is significantly slower than using `set.has(key)` to check existence in O(1) time before inserting. Pre-mapping all keys with `.map()` also incurs unnecessary array allocations compared to lazy single-pass processing.
**Action:** Use `if (!set.has(key)) { set.add(key); distinct.push(item); }` in single-pass loops when deduplicating elements with Immutable.Set.
