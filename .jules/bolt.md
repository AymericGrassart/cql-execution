# Bolt's Journal

## 2025-05-13 - String Equivalence Performance and Collator Reuse
**Learning:** `String.prototype.localeCompare(other, 'en', { sensitivity: 'base' })` re-initializes locale data and collation options on every invocation, adding heavy overhead (~800ms for 100k comparisons). Reusing a module-level `new Intl.Collator('en', { sensitivity: 'base' })` and short-circuiting on strict identity (`a === b`) reduces string equivalence check time by ~30x-90x (~9ms for 100k comparisons) with identical semantics.
**Action:** When performing locale-sensitive comparisons or normalizations in hot paths, avoid inline `localeCompare` options; instantiate and reuse an `Intl.Collator` instance.
