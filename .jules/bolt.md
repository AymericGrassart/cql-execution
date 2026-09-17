## 2025-03-09 - Reuse Intl.Collator for String Equivalence
**Learning:** Calling `String.prototype.localeCompare` with options (e.g. `{ sensitivity: 'base' }`) instantiates a new `Intl.Collator` object on every invocation in V8, causing significant CPU and allocation overhead (~3.8s for 500k iterations). Reusing a module-level `Intl.Collator` instance drops execution time to ~0.078s (48x speedup).
**Action:** Always reuse a module-scoped `Intl.Collator` instance instead of passing options to `localeCompare` in hot paths.
