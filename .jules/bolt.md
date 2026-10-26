## 2026-03-31 - Fast-Path Primitives in Comparison Utilities
**Learning:** In hot comparison utilities (`equals`, `equivalent`), checking `typeof` for primitive fast-paths early avoids property lookups (`isQuantity`, `isRatio`) and object allocations (`[a, b].map(...)`).
**Action:** When optimizing utility functions called repeatedly in evaluation loops, prioritize fast-path primitive type checks before checking object prototype properties or instantiating temporary arrays.
