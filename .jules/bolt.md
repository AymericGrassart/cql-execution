## 2025-05-18 - Avoid array allocation and closure overhead in hot comparison paths

**Learning:** In hot comparison utilities (such as `equals` and `equivalent` in CQL execution), calling higher-order array methods (`Array.map`, `Array.filter`, `Array.every`) creates closure scopes and intermediate array allocations on every invocation. Replacing these with simple `for` loops and direct array literals (`[{}.toString.call(a), {}.toString.call(b)]`) significantly improves execution speed and reduces GC pressure. Additionally, early returning `false` on mismatch in deep key comparisons preserves short-circuit behavior.

**Action:** When optimizing hot core utilities that operate on large numbers of data structures, prefer primitive operators (`typeof`), direct loop iterations, and early returns over higher-order array methods.
