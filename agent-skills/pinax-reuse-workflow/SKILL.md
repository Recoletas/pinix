---
name: pinax-reuse-workflow
description: Use when importing, removing, replacing, or syncing an upstream Pinax module; preserves lineage, dependency closure, owners, and contracts.
---

# Pinax reuse workflow

## Read first

- `docs/reuse-ledger.md`
- `docs/architecture.md`
- the relevant entry in `docs/src/code-map.md`
- the upstream implementation and its callers/tests

## Required procedure

1. State the author task and upstream SHA. Search for an existing implementation before adding a mobile equivalent.
2. Trace imports, dynamic routes, workers, assets, shared contracts, storage keys, and server endpoints. Move the dependency closure, not an isolated filename.
3. Name the unique data owner and persistence boundary. Platform adapters may translate storage, files, lifecycle, and origin; they must not own a second book/worldbook/agent model.
4. Classify affected assets in `docs/reuse-ledger.md`: unchanged, adapted, present but disabled, excluded with evidence, or unverified.
5. Keep upstream import and mobile adaptation reviewable as separate commits. Prefer cherry-pick or a documented patch for later fixes.
6. Run focused inherited tests plus the mobile check. Separate baseline failures from regressions.

## Handoff

Report upstream and target paths, preserved owner/contract, intentional differences, validation, and remaining sync risk. “Rewritten for mobile” is not sufficient justification.

