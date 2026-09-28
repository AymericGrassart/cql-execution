## 2026-09-28 - Avoid inline Intl options in String.prototype.localeCompare

**Learning:** Calling `String.prototype.localeCompare(other, 'en', { sensitivity: 'base' })` constructs a new `Intl.Collator` instance on every single execution in V8/Node.js, causing huge performance overhead (~8-10us per call vs ~0.16us with cached collator).
**Action:** Reuse a module-level `Intl.Collator` instance (`new Intl.Collator('en', { sensitivity: 'base' })`) and call `collator.compare(a, b)` for case/locale-insensitive string comparisons.
