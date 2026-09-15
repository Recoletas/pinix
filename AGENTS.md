# AGENTS.md — Pinax Mobile

## Project

Pinax Mobile is an independent mobile product repository derived from Pinax. It keeps the Vue 3, Pinia, Tiptap/ProseMirror, Express and authoring-harness implementation, and adds a Capacitor Android host plus platform adapters. Android is first; Web remains a supported development target.

Canonical state and architecture live in `docs/STATUS.md`, `docs/architecture.md`, and `docs/reuse-ledger.md`. Skills live only in `agent-skills/`; `.agents/skills` and `.claude/skills` are generated links.

## Session start

1. Read `docs/STATUS.md`.
2. Read `LOCAL.md` only when it exists and is non-empty. Never write it.
3. Claim the task in STATUS with owner, branch/worktree, write scope, dependency and interface impact before parallel work.

## Branches and ownership

- `main` must stay buildable. Use `feat/<scope>-<task>`, `fix/<scope>-<task>`, or another conventional task branch.
- Parallel workers use this repository's worktrees or disjoint write sets. Coordinate lockfile, router, shared contracts, API origin, storage owner and Capacitor files through the integration maintainer.
- `pinax-upstream` is source lineage, not a push target. Do not create or push an `origin` without maintainer direction.
- UI/composable → domain service/transaction → unique owner → platform storage. Never add `mobileBookStore`, a second worldbook, or a second agent loop.

## Required skills

| Trigger | Skill |
|---|---|
| import/remove/replace/sync inherited Pinax code | `pinax-reuse-workflow` |
| mobile UI/storage/files/network/lifecycle/Capacitor | `mobile-platform-workflow` |
| context/tool/session/candidate/adoption changes | `harness-change-check` |
| UI/style/responsive interaction | `ui-style-check` |
| worldbook/import/context builder | `worldbook-workflow` |
| map/geography/render worker | `map-engine-workflow` |
| AGENTS/CLAUDE/skills/shims/STATUS structure | `agent-maintenance` |
| behavior/status/docs changed | `docs-status-handoff` |
| before claiming completion | `testing-verification` |
| before commit | `commit-conventions` |

Use every applicable skill. Repository skills must not depend on a contributor's private CLI path, global plugin or API key.

## Delivery rules

- Preserve upstream attribution, history, IDs, revisions, source refs, candidate/formal boundaries and author-controlled adoption.
- No key, private manuscript, localStorage dump, certificate, device path or personal account in commits, screenshots or fixtures.
- Do not lower the inherited 20-file/200-test budget or disable checks to pass.
- Report implemented, Web passed, Android sync passed, APK built, device passed and real-model passed as separate states.
- Update STATUS/PLAN/LOG and the reuse ledger when behavior or lineage changes. Handoffs say what changed, entry point, read/write owner, verification, limitation and next owner.

