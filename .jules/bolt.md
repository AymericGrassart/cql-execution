# Bolt's Journal - Critical Learnings

This file logs critical learnings and performance insights specific to this repository.

## 2025-10-21 - Avoiding Array Allocations in Hot Utilities

**Learning:** Hot utility functions like `convertUnit` in `src/util/units.ts` and `getClassOfObjects`/`isFunction` in `src/util/comparison.ts` are called millions of times during CQL expression evaluation.
- `[a, b].map(fn)` creates temporary arrays and closures on every call; using direct assignments `a = fn(a); b = fn(b);` avoids GC pressure.
- `typeof fn === 'function'` is significantly faster than `{}.toString.call(fn)` or `instanceof Function`.
- In `convertUnit`, calling `fixUnit` twice on input arguments was redundant since `utils.convertUnitTo` already received the converted units.

**Action:** Prefer direct variable assignments over `.map()` for small fixed argument lists in utility helpers, and use `typeof` checks for primitive type queries in hot execution loops.
