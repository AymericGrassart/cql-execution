# Bolt's Journal

## 2025-05-18 - Avoid duplicate expression evaluation in ELM operator classes
**Learning:** Overloaded or compound ELM expression execution methods must reuse evaluated argument results (from `await this.execArgs(ctx)`) rather than invoking `this.execArgs(ctx)` multiple times in the same `exec` call, as re-evaluating child expressions causes duplicate computation.
**Action:** Always check that `execArgs(ctx)` result is stored in a local variable and passed directly to underlying evaluation helpers.
