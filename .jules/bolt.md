## 2025-05-20 - Comparison & List Deduplication Hot Path Optimization
**Learning:** In CQL execution, comparison functions (`equals`, `equivalent`, `lessThan`, `deepCompareKeysAndValues`) and set operations (`toDistinctList`) are evaluated millions of times during query execution.
- Avoid allocating temporary arrays or callback functions in helper functions like `getClassOfObjects` - use direct `Object.prototype.toString.call()` calls instead.
- In object comparisons (`deepCompareKeysAndValues`), check whether key counts match before sorting key arrays (`Object.keys()`), and merge key equality and value evaluation into a single loop to short-circuit early on mismatch or failure.
- In `Immutable.Set` deduplication (`toDistinctList`), use `!set.has(key)` before `set.add(key)` rather than checking `set.count()` before and after insertion.
**Action:** Always check for object allocation overhead and missing early returns in equality comparison and set deduplication routines.
