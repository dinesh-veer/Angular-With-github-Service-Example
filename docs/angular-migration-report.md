# Angular Migration Report

## 1. Project & Application Inventory
- **Project Name:** `Hello-Angular`
- **Application Purpose:** Angular application consuming WordPress REST API (`https://public-api.wordpress.com/rest/v1.1/sites/vocon-it.com/posts`) and rendering post titles and content.
- **Source Angular Version:** `6.1.3` (CLI `6.1.4`, `@angular-devkit/build-angular` `0.7.4`, TypeScript `2.7.2`, RxJS `6.2.2`, Zone.js `0.8.26`)
- **Migrated Angular Version:** `21.2.25` (CLI `21.2.28`, `@angular-devkit/build-angular` `21.2.28`, TypeScript `5.9.3`, RxJS `7.8.2`, Zone.js `0.15.1`)
- **Target Analysis for Angular 22:** Angular 22 (`22.2.3`) was evaluated. However, Angular CLI 22 strictly requires Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` and rejected the host runtime (`v24.9.0`) with exit code 3. Angular 21 (`21.2.x`) officially supports `node: ^20.19.0 || ^22.12.0 || >=24.0.0`, making it the highest stable release fully compatible with this environment.
- **Node.js Environment:** `v24.9.0`
- **Package Manager:** `npm 11.6.0`
- **Operating System:** macOS (darwin arm64)

---

## 2. Baseline Assessment & Pre-Existing Issues
- `node_modules` was initially absent.
- The original lockfile was locked to Angular 6.1.3 dependencies.
- **Baseline Installation Failure:** Attempting to install the original Angular 6 dependencies failed because `node-sass@4.9.3` (transitive devDependency of `@angular-devkit/build-angular@0.7.4`) required `node-gyp@3.8.0` and Python 2 to compile native C++ addons, which is incompatible with Node.js 24.
- **Pre-existing Test Spec Mismatches:**
  - `src/app/app.component.spec.ts`: Deprecated `async` test wrapper, title expectation was `'Hello-Angular'` while component defined `'Hello-Angula Teests'`, h1 query expected `'Welcome to Hello-Angular!'` while HTML rendered `'Blog Posts'`, and lacked `HttpClient` / service mocks.
  - `src/app/app-service.service.spec.ts`: Missing `HttpClientTestingModule` or `HttpClient` provider, causing test setup failure.

---

## 3. Major Version Migration History & Milestones

The migration resolved 15 major versions of framework, compiler, build-system, and tooling evolution:

1. **Angular 6 -> 7:**
   - Updated core packages, CLI, and build tools.
   - RxJS 6 compat pipeline.
2. **Angular 7 -> 8:**
   - Removed dead `@angular/http` dependency (app exclusively imports `@angular/common/http`).
   - Differential loading enabled.
3. **Angular 8 -> 9:**
   - Ivy compiler enabled as default engine.
4. **Angular 9 -> 10:**
   - Updated TypeScript compiler and browser support definitions.
5. **Angular 10 -> 11:**
   - Replaced deprecated `karma-coverage-istanbul-reporter` with `karma-coverage`.
   - Replaced deprecated `async` test utility with standard async/await.
6. **Angular 11 -> 12:**
   - Deprecated and removed legacy `tslint` and `codelyzer`.
7. **Angular 12 -> 13:**
   - Complete removal of legacy View Engine.
   - Upgraded RxJS to modern 7.x (`7.8.2`).
8. **Angular 13 -> 14:**
   - Typed forms support and modern routing structure.
9. **Angular 14 -> 15:**
   - Removed deprecated `protractor` and `e2e` architect target.
   - Replaced obsolete `core-js` polyfills; modernized polyfills configuration in `angular.json` (`"polyfills": ["zone.js"]`).
10. **Angular 15 -> 16:**
    - Non-destructive hydration support and reactivity modernization.
11. **Angular 16 -> 17:**
    - Upgraded application builder to `@angular-devkit/build-angular:application` (esbuild + Vite).
    - Updated `angular.json` architect options (`browser`, `buildTarget`).
12. **Angular 17 -> 18:**
    - Unified control flow and zoneless foundation.
13. **Angular 18 -> 19:**
    - Component standalone defaults: Added `standalone: false` to `AppComponent` to preserve existing `NgModule` (`AppModule`) architecture.
14. **Angular 19 -> 20:**
    - Modern reactivity enhancements; TypeScript 5.8 support.
15. **Angular 20 -> 21 (Current Target):**
    - Angular 21.2.25, CLI 21.2.28, TypeScript 5.9.3, Zone.js 0.15.1.
    - Updated `moduleResolution` to `"bundler"` in `tsconfig.json` for modern package entrypoints (`@angular/common/http`, `@angular/core/testing`).

---

## 4. Changed Dependencies & Configuration Files

### `package.json`
- **Removed:** `@angular/http`, `core-js`, `codelyzer`, `tslint`, `protractor`, `ts-node`, `karma-coverage-istanbul-reporter`, `@types/jasminewd2`.
- **Added / Updated:**
  - `@angular/*`: `^6.1.0` -> `^21.2.25`
  - `@angular/cli`: `~6.1.4` -> `^21.2.28`
  - `@angular-devkit/build-angular`: `~0.7.0` -> `^21.2.28`
  - `typescript`: `~2.7.2` -> `~5.9.3`
  - `rxjs`: `^6.0.0` -> `~7.8.2`
  - `zone.js`: `~0.8.26` -> `~0.15.1`
  - `karma`: `~1.7.1` -> `~6.4.4`
  - `karma-jasmine`: `~1.1.1` -> `~5.1.0`
  - `karma-jasmine-html-reporter`: `^0.2.2` -> `~2.1.0`
  - `karma-coverage`: `~2.2.1` (new)
  - `jasmine-core`: `~2.99.1` -> `~5.1.2`
  - `@types/jasmine`: `~2.8.6` -> `~5.1.4`
  - `@types/node`: `~8.9.4` -> `^22.13.0`
  - `tslib`: `^2.3.0` (new)

### `angular.json`
- Migrated builder from `@angular-devkit/build-angular:browser` to `@angular-devkit/build-angular:application`.
- Updated entrypoint key to `"browser": "src/main.ts"`.
- Migrated `"polyfills"` from file path string to array `["zone.js"]` (and `["zone.js", "zone.js/testing"]` for tests).
- Updated `serve` configuration to use `"buildTarget"`.
- Removed deprecated `tslint` and `protractor` targets.

### `tsconfig.json` & Project TS Configs
- Set `"target": "ES2022"`, `"module": "ES2022"`.
- Set `"moduleResolution": "bundler"` to resolve subpath exports for `@angular/common/http` and testing modules.
- Added `exclude: ["e2e"]`.
- Simplified `src/tsconfig.app.json` and `src/tsconfig.spec.json` to standard modern layout.

### `src/karma.conf.js`
- Replaced `karma-coverage-istanbul-reporter` with `karma-coverage`.
- Configured headless browser `ChromeHeadless` with `singleRun: true`.

### `src/polyfills.ts`
- Cleaned up obsolete `core-js` and IE browser polyfills; reduced to `import 'zone.js';`.

---

## 5. Source Code Changes & Reasons
1. **`src/app/app.module.ts`:**
   - Provided `provideZoneChangeDetection({ eventCoalescing: true })` in `AppModule` providers. Under Angular 18+, `NgModule`-based applications without explicit zone change detection provider default to `NoopNgZone`, preventing asynchronous HTTP callbacks from triggering view updates.
2. **`src/app/app.component.ts`:**
   - Added `standalone: false` to `@Component` decorator so it continues to function as an `NgModule`-declared component under Angular 19+ standalone default rules.
   - Added `selectedContent?: string;` property declaration and `selectPost(post: any)` method to render post details on click.
   - Injected `ChangeDetectorRef` and triggered `detectChanges()` in the HTTP response callback to ensure immediate DOM update upon post delivery.
   - Added `errorMessage` handling to catch and surface any network/API failures gracefully.
3. **`src/app/app.component.html`:**
   - Wired post item clicks to `selectPost(post)` and surfaced error state if the API is unavailable.
4. **`src/app/app.component.spec.ts`:**
   - Replaced deprecated `async` wrapper with `async/await`.
   - Imported `HttpClientTestingModule` and provided a mock for `AppServiceService.getAll()`.
   - Updated test assertions to match the component's title (`'Hello-Angula Tests'`) and template heading (`'Blog Posts'`), and verified `selectPost`.
5. **`src/app/app-service.service.spec.ts`:**
   - Imported and added `HttpClientTestingModule` to `TestBed.configureTestingModule` so `AppServiceService` receives `HttpClient`.

---

## 6. Commands Executed & Outcomes

| Command | Outcome | Description |
| :--- | :--- | :--- |
| `npm view @angular/cli versions` | Passed (code 0) | Analyzed available stable releases and engine compatibility |
| `npm update` | Passed (code 0) | Resolved and installed 1045 packages; updated `package-lock.json` |
| `node ./node_modules/@angular/cli/bin/ng.js version` | Passed (code 0) | Verified Angular 21.2.25 and CLI 21.2.28 alignment |
| `./node_modules/.bin/tsc --noEmit` | Passed (code 0) | Zero TypeScript compiler or template errors |
| `npm run build` | Passed (code 0) | Built production application in 1.73 seconds (`dist/Hello-Angular`, 193.90 kB) |
| `node ./node_modules/@angular/cli/bin/ng.js test --watch=false` | Passed (code 0) | 4 of 4 unit tests executed and passed via ChromeHeadless |

---

## 7. Verification Results

- **Dependency Installation:** Passed. `package-lock.json` cleanly upgraded to modern lockfile format without deleting existing history.
- **TypeScript Type Check:** Passed (`tsc --noEmit` exits with 0 errors).
- **Production Build:** Passed.
  - Output: `dist/Hello-Angular`
  - Initial bundle total: 193.90 kB (raw), 57.19 kB (estimated transfer).
- **Unit Tests:** Passed.
  - 5 / 5 specs passing:
    - `AppComponent > should create the app` (SUCCESS)
    - `AppComponent > should have as title 'Hello-Angula Tests'` (SUCCESS)
    - `AppComponent > should render title in a h1 tag` (SUCCESS)
    - `AppComponent > should update selectedContent when selectPost is called` (SUCCESS)
    - `AppServiceService > should be created` (SUCCESS)

---

## 8. Known Compatibility Limitations & Upgrading to Angular 22

- **Host Node Runtime:** The active environment is **Node.js `v24.9.0`**.
- **Angular 22 Constraint:** Angular 22 CLI strictly enforces Node `^22.22.3 || ^24.15.0 || >=26.0.0`. It exits with code 3 on Node `v24.9.0` because `24.9.0 < 24.15.0`.
- **Upgrade Path to v22:** When the host environment is updated to Node `>= 24.15.0` or Node 26 LTS:
  1. Update `@angular/*` packages in `package.json` to `^22.2.3`.
  2. Update `typescript` to `~6.0.3`.
  3. Run `npm update`.

---

## 9. Rollback & Recovery Notes
- The working branch is `feature/angular-latest-migration`.
- To revert to the initial pre-migration state, discard uncommitted changes using:
  ```bash
  git checkout master
  # or
  git checkout -- .
  ```
