# GitHub Explorer

A responsive, feature-rich web application built with **Angular 21** that transforms the repository into an explorer for the official **GitHub REST API (v3)**. It enables searching repositories, developer profiles, and repository issues with real-time rate limit tracking, reactive queries, debouncing, and pagination.

---

## Features

### 1. Dashboard (Discover GitHub)
- **Hero Search Interface:** Global search bar with instant scope filters (Repositories, Users, Issues).
- **Popular Repositories Grid:** Quick exploration cards for popular open-source frameworks (e.g. `angular/angular`, `facebook/react`, `spring-projects/spring-boot`, `microsoft/vscode`, etc.).
- **Live Rate-Limit Header:** Real-time visibility into your IP's GitHub remaining request quotas and reset timer.

### 2. Repository Search
- **Multi-Filter Queries:** Search repositories by keyword, owner, language (`TypeScript`, `Java`, `Python`, etc.), and topic.
- **Sorting Options:** Sort results by stars, forks, or recently updated date.
- **Repository Cards:** Displays owner avatar, repo name, description, primary language badge with color dot, star counter, fork counter, and relative update time.
- **Pagination:** Smooth page switching powered by GitHub's `Link` response headers.

### 3. Repository Details
- **Repository Overview:** Star/Fork count badges, topics chips, branch name, and license badge.
- **Multi-Tab Interface:**
  - **Overview:** README preview, multi-color languages distribution bar, and top contributors avatars.
  - **README:** Full rendered README content decoded from GitHub Base64 payload.
  - **Commits:** Recent commits with author avatar, commit message, SHA hash, and relative date.
  - **Contributors:** Contributor list with avatars, profile links, and contribution counts.
  - **Issues:** Recent open issues with quick links to view on GitHub or inspect in the Issues Explorer.
  - **Languages:** Detailed byte-by-byte language breakdown with percentages.

### 4. Developer & User Explorer
- **User Search:** Search GitHub developers, contributors, and organizations.
- **User Cards:** Displays user avatar, username, name, organization type badge, and links.
- **Dedicated Profile View (`/users/:username`):**
  - Developer banner with avatar, company, location, website/blog, and join date.
  - Interactive follower, following, and public repository counts.
  - Public repository grid with stars, forks, language badges, and update timestamps.
  - Followers and Following interactive tabs.

### 5. Issues Explorer
- **Flexible Search:** Inspect issues for any repository in `owner/repo` format (e.g., `spring-projects/spring-boot`).
- **State & Label Filters:** Filter by `Open`, `Closed`, or `All` states, with optional label and assignee filters.
- **Pull Request Distinction:** Distinct visual badges and icons separating PRs from standard issues.
- **Issue Details:** Title, issue number, author, creation timestamp, comment count, and external GitHub links.

---

## Technology Stack

- **Framework:** Angular `21.2.25`
- **CLI:** Angular CLI `21.2.28`
- **Language:** TypeScript `5.9.3`
- **Reactive Extensions:** RxJS `7.8.2`
- **Zone Engine:** Zone.js `0.15.1`
- **API Protocol:** GitHub REST API v3 (`https://api.github.com`)
- **Testing:** Jasmine `5.6.0`, Karma `6.4.4`, ChromeHeadless

---

## Architecture & Folder Structure

```
src/app/
├── core/
│   ├── interceptors/
│   │   ├── github-headers.interceptor.ts   # Adds standard GitHub API headers & versioning
│   │   └── rate-limit.interceptor.ts       # Captures X-RateLimit headers and 403 errors
│   ├── models/
│   │   ├── github-commit.model.ts          # Strongly typed commit models
│   │   ├── github-issue.model.ts           # Strongly typed issue & label models
│   │   ├── github-repo.model.ts            # Strongly typed repository models
│   │   ├── github-user.model.ts            # Strongly typed user models
│   │   ├── pagination.model.ts             # Pagination metadata models
│   │   └── rate-limit.model.ts             # Rate limit models
│   ├── services/
│   │   ├── github-api.service.ts           # Centralized API service for all GitHub endpoints
│   │   └── rate-limit.service.ts           # Reactive BehaviorSubject for rate limit status
│   └── utils/
│       └── link-header.parser.ts           # Parser for RFC 5988 Link headers
├── features/
│   ├── dashboard/                          # Dashboard & global search
│   ├── repositories/
│   │   ├── repository-search/              # Keyword & language repository search
│   │   └── repository-details/             # Detail view (README, commits, stats, tabs)
│   ├── users/
│   │   ├── user-search/                    # Developer search
│   │   └── user-profile/                   # Developer profile & public repos
│   └── issues/
│       └── issue-explorer/                 # Issues search and filtering
├── shared/
│   ├── components/
│   │   ├── empty-state/                    # Reusable empty result placeholder
│   │   ├── error-banner/                   # Error display with retry trigger
│   │   ├── language-badge/                 # GitHub language badge with color dots
│   │   ├── loading-spinner/                # Accessible animated loading spinner
│   │   ├── pagination/                     # Page numbers & next/prev navigation
│   │   ├── rate-limit-banner/              # Warning banner when rate limit approaches 0
│   │   └── stat-chip/                      # Star, fork, watcher count chips
│   └── pipes/
│       ├── number-format.pipe.ts           # Formats counts (e.g. 24500 -> 24.5k)
│       └── relative-date.pipe.ts           # Formats dates (e.g. "3 days ago")
├── app.component.*                         # Sidebar navigation, topbar, modal
├── app.routes.ts                           # Angular Router definitions
└── app.module.ts                           # Root module declarations & providers
```

---

## Routes and API Endpoints

### Application Routes
| Route | Component | Description |
|---|---|---|
| `/` | `DashboardComponent` | Home view with global search and featured repositories |
| `/repositories` | `RepositorySearchComponent` | Search and filter repositories |
| `/repositories/:owner/:repo` | `RepositoryDetailsComponent` | Full repository details, tabs, README, and metrics |
| `/users` | `UserSearchComponent` | Search GitHub users and developers |
| `/users/:username` | `UserProfileComponent` | User profile, follower counts, and public repositories |
| `/issues` | `IssueExplorerComponent` | Search and filter issues for any repository |

### GitHub REST API Endpoints Used
| Endpoint | Method | Purpose |
|---|---|---|
| `/search/repositories` | `GET` | Search repositories by keyword, language, and topic |
| `/search/users` | `GET` | Search GitHub users |
| `/repos/{owner}/{repo}` | `GET` | Get detailed repository information |
| `/repos/{owner}/{repo}/languages` | `GET` | Get byte counts for programming languages |
| `/repos/{owner}/{repo}/contributors` | `GET` | Get repository contributors |
| `/repos/{owner}/{repo}/commits` | `GET` | Get recent commit history |
| `/repos/{owner}/{repo}/readme` | `GET` | Fetch Base64-encoded repository README |
| `/repos/{owner}/{repo}/issues` | `GET` | List repository issues and pull requests |
| `/users/{username}` | `GET` | Fetch public user profile |
| `/users/{username}/repos` | `GET` | Fetch user's public repositories |
| `/users/{username}/followers` | `GET` | Fetch user followers |
| `/users/{username}/following` | `GET` | Fetch user following |
| `/rate_limit` | `GET` | Check remaining rate limit quotas |

---

## Prerequisites and Setup

- **Node.js:** `v24.9.0` (or Node `22.x` / `24.x`)
- **Package Manager:** `npm` 10+

### Installation
```bash
git clone <repository-url>
cd Angular-With-github-Service-Example
npm install
```

---

## Local Development Commands

### Start Development Server
```bash
npm start
# or: ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload if source files change.

### Build Production Bundle
```bash
npm run build
```
Production build artifacts are compiled with optimization into `dist/Hello-Angular`.

### Run Unit Tests
```bash
npm test -- --watch=false
```
Executes all Jasmine unit tests using Karma and headless Chrome.

---

## GitHub API Rate Limits

Unauthenticated requests to the GitHub REST API have the following default limits:
- **Core Endpoints:** 60 requests per hour per IP address.
- **Search Endpoints:** 10 requests per minute per IP address.

### Rate Limit Safeguards in this Application
1. **Debounce (350–400ms):** Typing in search fields debounces input to prevent spamming GitHub API endpoints.
2. **Obsolete Request Cancellation:** Utilizes RxJS `switchMap` so obsolete in-flight requests are automatically cancelled when a new query is typed.
3. **Reactive Rate Limit Interceptor:** Captures `x-ratelimit-remaining` and `x-ratelimit-reset` headers on every response.
4. **Rate Limit Banner:** Displays an informative banner with a countdown timer whenever rate limits are low or exhausted.
