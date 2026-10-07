## 2025-10-07 - Fast-pathing Single-Source Cartesian Product Evaluation

**Learning:** `cartesianProductOf` in `src/elm/query.ts` evaluated single-source query results through `.reduce()` with `.forEach()` and `a.concat([b])`. Since single-source queries represent the vast majority of CQL query execution operations, allocating intermediate arrays `[b]` and calling `.concat()` on every element caused significant garbage collection and execution overhead. Fast-pathing `sources.length === 1` via `sources[0].map(x => [x])` avoids all intermediate `concat()` array allocations.

**Action:** When evaluating relational algebra or set operations (like queries, joins, cartesian products), always check if the single-input/single-source fast path can avoid standard N-ary reduction logic.
