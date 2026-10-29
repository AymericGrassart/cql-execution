# Bolt's Performance Journal

## 2025-05-18 - Optimizing `toDistinctList` Deduplication in CQL Queries
**Learning:** In `cql-execution`, `toDistinctList` is called on almost all CQL query results and set operators. The original implementation called `list.map(toNormalizedKey)` up-front (allocating an intermediate keys array) and invoked `y.count()` twice per element (`setSize = y.count()`, `y.add(key)`, `y.count() > setSize`) on Immutable.Set to detect new insertions. Replacing `y.count()` comparisons with `!y.has(key)` and adding a fast path for lists with length <= 1 (`list.slice()`) yielded an 11x speedup on small lists (0-1 elements) and ~1.6x speedup on larger lists.
**Action:** For set operations using Immutable.Set, use `!set.has(key)` before `set.add(key)` instead of tracking `.count()` changes, and avoid `map()` allocations when iterating items for set insertion.
