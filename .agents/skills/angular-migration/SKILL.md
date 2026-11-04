
---
name: angular-migration
description: Analyze, plan, migrate, and verify an existing Angular application to the latest stable compatible Angular release. Use for Angular version upgrades, dependency migrations, Angular CLI migrations, and migration troubleshooting.
---

# Angular Migration Skill

## Objective

Upgrade the current Angular application to the latest stable,
supported Angular major version that is compatible with its
environment and required dependencies.

Preserve application functionality and produce a migration report.

## Phase 1: Discover the project

1. Identify the workspace root and all Angular applications.
2. Identify package.json and the active package manager.
3. Inspect package-lock.json, pnpm-lock.yaml, or yarn.lock.
4. Inspect angular.json, tsconfig files, and project configuration.
5. Run ng version when dependencies are installed.
6. Identify the versions of:
   - @angular/core
   - @angular/cli
   - @angular/compiler-cli
   - @angular-devkit/build-angular or the active builder
   - TypeScript
   - RxJS
   - Zone.js, if used
7. Inspect Angular Material, CDK, NgRx, Nx, UI libraries,
   test frameworks, build plugins, and other Angular integrations.
8. Identify standalone components, NgModules, routing,
   SSR, hydration, custom builders, and monorepo configuration.
9. Inspect scripts for build, test, lint, and end-to-end tests.
10. Check Git status and preserve all user changes.

Do not assume every project uses npm, a single application,
Karma, Zone.js, or the default Angular builder.

## Phase 2: Establish a baseline

1. Install dependencies using the existing lockfile and package manager.
2. Record installation failures.
3. Run the existing production build.
4. Run existing unit tests and lint checks when available.
5. Record baseline failures separately from migration failures.
6. Inspect the existing application behavior and routes where possible.
7. Do not modify the application during baseline collection.

If the baseline cannot be established, explain why and continue
only with clearly documented limitations.

## Phase 3: Determine the target

1. Consult official sources:
   - https://angular.dev/reference/releases
   - https://angular.dev/reference/versions
   - https://angular.dev/update
   - https://angular.dev/cli/update
2. Determine the latest stable Angular target at execution time.
3. Exclude prerelease versions unless explicitly requested.
4. Check supported Node.js, TypeScript, and RxJS combinations.
5. Check Angular CLI and framework version alignment.
6. Check peer dependencies for every important third-party package.
7. Check the official update guide for every major-version transition.
8. If the latest target is incompatible with a required dependency,
   identify the blocker and propose supported alternatives.

Do not blindly choose the numerically highest package version.

## Phase 4: Create a migration plan

Before editing, summarize:

- Source Angular and CLI versions.
- Target Angular and CLI versions.
- Required Node.js and TypeScript changes.
- Third-party dependency upgrades.
- Major-version migration sequence.
- Expected source-code changes.
- Build and test strategy.
- Risks, blockers, and rollback approach.

Prefer one major version at a time.

If the starting version is outside Angular's supported direct
update path, use sequential major-version migrations. For example,
a migration from 18 to 22 should follow 18 -> 19 -> 20 -> 21 -> 22,
subject to compatibility and official guidance.

Do not skip intermediate migrations just to save time.

## Phase 5: Migrate incrementally

For each major-version transition:

1. Consult the official Angular Update Guide for the exact
   source and target versions.
2. Verify Node.js and TypeScript compatibility.
3. Upgrade Angular framework and CLI packages using official
   Angular CLI update mechanisms.
4. Upgrade related packages only to compatible versions.
5. Run the applicable official CLI migrations.
6. Apply documented breaking-change fixes.
7. Update application code only when required or explicitly approved.
8. Update Angular Material, CDK, and other ecosystem packages
   using their supported migration procedures when applicable.
9. Update tests, builders, configuration, and polyfills as needed.
10. Install dependencies with the existing package manager.
11. Run build, tests, and lint checks.
12. Review the Git diff and investigate regressions.
13. Resolve migration-caused failures before proceeding.
14. Record changes and validation results for this transition.

If a transition is blocked, stop and report the exact error,
the attempted resolution, and the recommended next action.

Do not continue blindly through a broken intermediate version.

## Phase 6: Modernize carefully

Do not combine a version migration with an optional rewrite.

After the version migration succeeds, assess optional improvements:
- Standalone component migration
- Built-in template control flow
- Signals and signal-based APIs
- Modern Angular testing APIs
- Build-system improvements
- SSR and hydration improvements

Perform optional migrations only when appropriate, supported,
tested, and approved. Preserve existing application behavior.

## Phase 7: Final verification

Run all applicable checks:

- Dependency installation
- Angular version inspection
- Production build
- Unit tests
- Lint checks
- End-to-end tests, if configured
- TypeScript and template checks
- Route and application smoke tests where feasible
- Git diff and lockfile review

Compare results with the baseline. Identify pre-existing failures,
migration regressions, skipped checks, and unresolved issues.

Never report success based solely on a successful dependency install.

## Phase 8: Produce the report

Create docs/angular-migration-report.md.

Include:
1. Project and application inventory.
2. Original and target Angular versions.
3. Node.js and package-manager versions.
4. Version-by-version migration history.
5. Changed dependencies and configuration files.
6. Important source-code changes and reasons.
7. Commands executed and their actual outcomes.
8. Build, test, lint, and smoke-test results.
9. Pre-existing failures and new failures.
10. Known compatibility limitations.
11. Manual steps required.
12. Rollback and recovery notes.

Finish with a concise summary of what is complete,
what is blocked, and what still requires human review.
