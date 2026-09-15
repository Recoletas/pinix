---
name: mobile-platform-workflow
description: Use when changing mobile UI, persistence, files, networking, lifecycle, Capacitor, or Android configuration; separates Web, build, and device evidence.
---

# Mobile platform workflow

## Read first

- `docs/architecture.md`
- `docs/verification-and-release.md`
- `src/platform/`
- `capacitor.config.json`

## Required procedure

1. Identify Web/Android behavior and effects on durability, permissions, IME/focus, back navigation, safe areas, streaming, and secrets.
2. Keep business writes in inherited owners. Await native persistence before showing saved/adopted state; never treat a Promise as boolean success.
3. Bundle local assets. Resolve API origin centrally, use HTTPS outside explicit local development, and never assume device localhost is the server.
4. For UI check 390px portrait, landscape/narrow height, dark mode, safe areas, 44px touch targets, keyboard visibility, focus, and selection return.
5. Run `npm run mobile:check`, `npm run build:mobile`, and `npm run mobile:sync`. Run Gradle and a real-device scenario when available.
6. Label evidence precisely: implemented, contract passed, Web passed, Android sync passed, APK built, or device passed.

## Handoff

Include platform/device, permission/config changes, artifact path, commands and exit codes, missing environment, and rollback/migration implications. A resized browser does not prove IME or process-death behavior.

