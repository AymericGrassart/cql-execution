## 2026-10-18 - Avoid Luxon `DateTime.fromFormat` in Cold-Path / High-Frequency Parsers

**Learning:** In date/datetime parsing functions (`Date.parse` and `DateTime.parse`), calling Luxon's `DateTime.fromFormat` or format lookup maps for format validation introduces significant CPU overhead due to internal string manipulation and Luxon instance allocations. Reusing captured regex match components to validate numeric date/time ranges (year, month 1-12, day 1-daysInMonth, hour 0-23, minute/second 0-59, timezone offset) is ~20-25x faster while maintaining exact validation semantics.

**Action:** When validating ISO/CQL date and time string formats, validate integer component boundaries directly from regex matches instead of constructing external date library format instances.
