## 2025-05-18 - Avoid Immutable.Set.count() for Uniqueness Checks and Add Singleton Fast-Paths

**Learning:** `toDistinctList` in `cql-execution` was being called on query results and list operations, frequently receiving 0- or 1-element lists. For larger lists, it mapped all items to normalized keys upfront into an intermediate array and checked uniqueness by comparing `y.count()` before and after `y.add(key)`. Comparing `count()` twice per item adds unnecessary function overhead.

**Action:** Add fast-path early returns for 0- and 1-element arrays (`if (list.length <= 1)`) and check membership directly using `!y.has(key)` when deduplicating with `Immutable.Set`.
