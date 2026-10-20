## 2025-05-18 - Avoid double count() checks for uniqueness in Immutable.Set
**Learning:** Checking set insertion via `y.count()` twice per item in `Immutable.Set` introduces unnecessary method overhead and forces re-insertions/mutations on duplicate keys.
**Action:** Use `!y.has(key)` membership check before `y.add(key)` when constructing unique lists with `Immutable.Set`.
