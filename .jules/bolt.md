## 2026-03-30 - Immutable.Set membership check vs count check in toDistinctList
**Learning:** Checking `y.count() > setSize` before and after calling `y.add(key)` on a mutable `Immutable.Set` forces `add()` to construct tree nodes even for duplicate keys, and calculates set size twice per element. Checking `if (!y.has(key))` prior to `y.add(key)` performs an O(1) read and skips tree mutation overhead for duplicates.
**Action:** Always use `if (!set.has(key)) { set.add(key); ... }` when populating sets or deduplicating lists with Immutable.js.

## 2026-03-30 - UCUM unit commensurables lookup caching
**Learning:** `UcumLhcUtils.prototype.commensurablesList` performs regex parsing and unit string analysis on every call. Normalizing quantities calls this frequently for common units like `mg`, `mm[Hg]`, `mL`. Caching unit lookup results in a simple `Map<string, any>` avoids repeated parsing in hot paths.
**Action:** Cache UCUM lookup calls for quantity normalization when processing repeated unit strings.
