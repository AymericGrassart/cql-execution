# Bolt's Journal - Critical Learnings

## 2024-11-07 - CQL Query Cartesian Product Single-Source Fast Path
**Learning:** In CQL, the overwhelming majority of queries evaluate a single data source (e.g., `[Condition] C where ...`). Previously, `cartesianProductOf` always ran an accumulator `reduce([[]])` using nested `forEach` callbacks and `.concat([item])` per record. This created unnecessary array allocations and closure overhead on hot query evaluation paths. Adding a fast path when `sources.length === 1` allows pre-allocating an array of 1-element arrays in $O(N)$ without intermediate arrays or closures.
**Action:** Always check if collection utility functions in the engine have a 1-source / single-element fast path to bypass general $N$-dimensional combinatorics.
