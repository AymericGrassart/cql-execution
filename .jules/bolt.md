## 2025-05-18 - Immutable.js Set Deduplication: `!set.has(key)` vs `set.count()`

**Learning:** Checking set growth by calling `set.count()` before and after `set.add(key)` inside `withMutations` on an Immutable.js mutable set incurs significant overhead ($2N$ count operations plus pre-mapping key arrays). Using $O(1)$ membership check `!set.has(key)` before `set.add(key)` avoids extra size calculations and permits single-pass streaming deduplication.

**Action:** In `toDistinctList` and similar collection deduplication functions, use `!set.has(key)` to test for presence before adding keys to mutable `Immutable.Set`.
