---
name: harness-change-check
description: Use when changing context compilation, tool authorization, run sessions, orchestration, candidates, adoption, or formal writing effects.
---

# Harness change check

## Read first

- `docs/architecture.md`
- `src/services/agents/context/`
- `src/services/agents/authoring/authoringRunSession.js`
- `src/services/agents/authoring/authoringRunSessionAdapter.js`
- `src/services/agents/narrativeAgentOrchestrator.js`
- `src/composables/useAuthoringGhostAdoptionWorkflow.js`

## Required procedure

1. Trace intent → eligible sources → manifest → authorization → frozen session → tools → candidate → adoption transaction → persistence.
2. Verify exclusions cannot return through tools; source refs and revisions survive packing; `totalChars` remains a character budget, not a claimed token count.
3. Check cancellation, timeout, bounded retry, duplicate identities, target changes, late results, and dependency staleness.
4. Keep candidates editable and outside formal prose until explicit adoption. Persistence failure retains a retryable pending transaction without reinsertion or duplicate effects.
5. Label deterministic fixtures as protocol evidence. Real-provider tests are separate, authorized, bounded, and exclude keys/private prose.
6. Run relevant contract/eval/smoke commands and `npm run verify:full`; mobile-facing changes also run `npm run verify:mobile`.

## Handoff

State scope/version fence, authorization, adoption owner, durable-save behavior, fixture evidence, real-model evidence, and untested cases.

