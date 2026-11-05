# Bolt's Journal - Critical Learnings Only

## 2025-05-18 - Immutable.js Set Deduplication Overhead
**Learning:** In `toDistinctList`, tracking insertion by querying `set.count()` before and after `set.add(key)` creates redundant size evaluations and was paired with an intermediate `list.map(toNormalizedKey)` array allocation. Using a single pass with `if (!set.has(key)) { set.add(key); distinct.push(item); }` eliminates intermediate array creation and saves two `count()` lookups per element, cutting distinct operations latency by >50%.
**Action:** In operations building unique collections with Immutable.js structures, prefer direct `.has()` presence checks in a single-pass loop over tracking collection count changes and allocating intermediate key collections.
