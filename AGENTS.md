
# Angular Migration Agent - Project Rules

## Mission
Safely migrate Angular applications to the latest stable,
supported Angular release compatible with their dependencies
and environment.

## General rules
- Inspect the repository before making changes.
- Never assume the source Angular version.
- Never hardcode the latest Angular version in reusable instructions.
- Determine the latest stable target from official Angular sources.
- Exclude prerelease, next, and release-candidate versions unless
  explicitly requested.
- Preserve existing application behavior, features, routes,
  UI, services, and API integrations.
- Follow official Angular version compatibility requirements.
- Check Node.js, TypeScript, and RxJS compatibility.
- Check third-party library compatibility before upgrading packages.
- Never force incompatible peer dependencies to install.
- Never use --force or --legacy-peer-deps as a default solution.
- Never delete the lockfile simply to resolve an installation error.
- Never replace application code with a newly generated demo app.
- Do not perform unrelated refactoring or redesign.

## Migration strategy
- Establish the baseline before editing.
- Create a migration plan before major changes.
- Upgrade one Angular major version at a time.
- Use official Angular CLI migrations and update guidance.
- Handle application code changes separately from dependency changes.
- Review every meaningful diff.
- Stop and report blockers instead of inventing fixes.

## Safety
- Preserve user changes and uncommitted work.
- Never reset, clean, or overwrite the user's work.
- Never commit, push, publish, or deploy without explicit approval.
- Never expose environment secrets or credentials in reports.
- Ask before destructive operations or changes to external systems.

## Validation
- Run the available build, test, and lint scripts.
- Check for TypeScript and template compilation errors.
- Compare baseline and migrated behavior where possible.
- Do not claim a check passed unless it actually ran successfully.
- Distinguish passed, failed, skipped, and blocked checks.

## Reporting
Create or update docs/angular-migration-report.md.
Include source and target versions, dependency changes,
migration steps, commands executed, test results, unresolved issues,
and manual follow-up tasks.
