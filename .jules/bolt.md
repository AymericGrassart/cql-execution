# Bolt's Journal

## 2025-05-18 - Avoid Array.prototype.shift() in asyncMergeSort and redundant Object stringification in comparisons
**Learning:**
1. In array merge algorithms (such as `asyncMergeSort`), using `Array.prototype.shift()` mutates and re-indexes the entire array on every element extraction, degrading time complexity from $O(N \log N)$ to $O(N^2 \log N)$ for large lists. Replacing `shift()` with index pointers `i` and `j` restores true $O(N \log N)$ behavior and eliminates array mutations.
2. In hot equality check paths (`equals` and `equivalent`), stringifying object classes via `[a, b].map(obj => ({}.toString.call(obj)))` creates unnecessary array allocations and string lookups. Fast-pathing primitive string identity `a === b` prior to `localeCompare` / regex replace, and fast-pathing key matching for matching object structures drastically reduces comparison overhead (~3x faster object equality checks).

**Action:**
- Use array index pointers instead of `.shift()` / `.pop()` in merge or queue operations.
- Avoid allocating temporary arrays or running generic `Object.prototype.toString.call` on primitive equality paths.
