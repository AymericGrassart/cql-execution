## 2025-10-02 - String equivalence and comparison fast-paths in `util/comparison.ts`

**Learning:** `String.prototype.localeCompare(..., 'en', { sensitivity: 'base' })` implicitly creates a new `Intl.Collator` on every call in V8/Node.js, causing string equivalence checks (`equivalent(strA, strB)`) to be extremely slow (~8.6s for 1M calls). Reusing a single module-level `Intl.Collator` instance combined with `a === b` early exit fast-paths reduced execution time for string equivalence by over 600x (~14ms for 1M calls).

**Action:** Whenever doing locale-sensitive string comparisons in loop-heavy runtime utilities, always cache the `Intl.Collator` instance and check identity equality (`a === b`) first.
