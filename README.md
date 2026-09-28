# Playwright API + UI Test Framework

A TypeScript Playwright framework with two independent suites you can run separately:

| Suite | Target | Command |
|-------|--------|---------|
| API | [DummyJSON](https://dummyjson.com) | `npm run test:api` |
| UI  | [SauceDemo](https://www.saucedemo.com) | `npm run test:ui` |

## Getting started

```bash
npm install
npx playwright install chromium
cp .env.example .env      # then adjust values if needed
npm run test:api
npm run test:ui
```

## Commands

| Command | What it does |
|---------|--------------|
| `npm test` | Run everything (API + UI) |
| `npm run test:api` | API suite only. No browser is launched |
| `npm run test:ui` | UI suite only (Chromium) |
| `npm run test:ui:headed` | UI suite with a visible browser |
| `npm run test:ui:debug` | UI suite in the Playwright Inspector |
| `npm run test:smoke` | Only tests tagged `@smoke` (both suites) |
| `npm run report` | Open the last HTML report |
| `npm run lint` / `npm run typecheck` | Static checks |

Standard Playwright flags still work, e.g. `npm run test:ui -- --grep "Checkout"` or `npm run test:api -- --workers=1`.

## Project structure

```
├── playwright.config.ts         # Projects: api-setup → api, ui-setup → ui-chromium
├── src/
│   ├── config/
│   │   ├── env.ts               # .env loading + zod validation (fail fast)
│   │   └── paths.ts             # Shared file paths (.auth/*)
│   ├── hooks/
│   │   ├── global-setup.ts      # Runs once before any project
│   │   └── global-teardown.ts   # Runs once after all projects
│   ├── pages/                   # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── components/HeaderComponent.ts
│   │   ├── LoginPage.ts  InventoryPage.ts  CartPage.ts  CheckoutPage.ts
│   │   └── index.ts             # Page object registry (auto-injected as fixtures)
│   ├── api/                     # API client layer
│   │   ├── BaseApiClient.ts  AuthClient.ts  ProductsClient.ts
│   │   └── schemas.ts           # zod response contracts
│   ├── fixtures/
│   │   ├── page-object.fixtures.ts  # Generic registry → fixtures builder
│   │   ├── ui.fixtures.ts       # Injects page objects + auto hook
│   │   └── api.fixtures.ts      # Injects API clients, auth context + auto hook
│   └── data/                    # Test data: users, products, faker factories
└── tests/
    ├── setup/                   # Suite-level auth (setup projects)
    │   ├── api.setup.ts
    │   └── ui.setup.ts
    ├── api/                     # 5 API tests
    └── ui/                      # 5 UI tests
```

## How the pieces fit

### Separate suites = separate projects
`playwright.config.ts` defines four projects:

```
api-setup  ──►  api            (npm run test:api  →  --project=api)
ui-setup   ──►  ui-chromium    (npm run test:ui   →  --project=ui-chromium)
```

When you select a project with `--project`, Playwright also runs its `dependencies`. So the API run authenticates only against the API, and the UI run only against the UI.

### Hooks, from widest to narrowest scope

| Scope | Mechanism | Used for |
|-------|-----------|----------|
| Whole run | `globalSetup` / `globalTeardown` | Env validation, creating `.auth/`, run banner, clearing tokens on CI |
| Per suite | Setup projects (`tests/setup/*.setup.ts`) | Log in once. UI saves `storageState`; API saves a bearer token |
| Per worker | Worker-scoped fixture (`accessToken`) | Read the token once per worker process |
| Per test | Auto fixtures (`browserErrorCollector`, `apiTimer`) | Global before/after-each behaviour without repeating `beforeEach` |
| Per file | `test.beforeEach` inside `describe` | Navigation specific to one spec |

Setup projects are preferred over doing everything in `globalSetup` because they show up in the HTML report, record traces, and can use fixtures.

### Page objects are injected automatically
Page objects are listed once in [src/pages/index.ts](src/pages/index.ts):

```ts
export const pageObjects = {
  loginPage: LoginPage,
  inventoryPage: InventoryPage,
  cartPage: CartPage,
  checkoutPage: CheckoutPage,
} as const;
```

`createPageObjectFixtures()` in [src/fixtures/page-object.fixtures.ts](src/fixtures/page-object.fixtures.ts) turns each entry into a fixture:

- **Lazy**: a page object is built only if the test asks for it.
- **Isolated**: each test gets new instances bound to its own `page`.
- **Typed**: fixture names and types come from the registry, so `{ cartPage }` is typed as `CartPage` with autocomplete.

Tests just ask for what they need:

```ts
test("user can complete a purchase", async ({ inventoryPage, cartPage, checkoutPage }) => { ... });
test("GET /auth/me returns the user", async ({ authClient }) => { ... });
```

## Best practices applied

- **Locators**: user-facing `getByRole` / `getByTestId` only. No CSS or XPath chains. `testIdAttribute` is set to `data-test` to match the app.
- **Web-first assertions**: `await expect(locator).toHaveText(...)` auto-waits. There are no `waitForTimeout` calls.
- **Page objects hold no business assertions**: they expose locators and actions; tests decide what is correct.
- **Composition over inheritance** for shared UI such as `HeaderComponent`.
- **Test isolation**: every test gets a fresh browser context or request context. Auth is reused through storage state or a token, never through shared mutable state.
- **Contract checks**: API responses are parsed with zod schemas, not just status-checked.
- **Unique data** from `@faker-js/faker` factories. Stable reference data lives in `src/data`.
- **Config via env**: URLs and credentials come from `.env` (git-ignored), validated at startup.
- **CI-aware**: retries, `forbidOnly`, traces on first retry, screenshots/videos on failure, HTML + JUnit reporters.
- **Tags** (`@smoke`) for selective runs. `test.step` for readable reports.
- **Path aliases** (`@pages/*`, `@api/*`, …) via `tsconfig.json`.
- **Static checks**: `tsc --noEmit` plus ESLint with `eslint-plugin-playwright`, which catches missing `await`s.

## Adding tests

**New UI page**: add `src/pages/FooPage.ts` extending `BasePage`, add `fooPage: FooPage` to the registry in `src/pages/index.ts`, then use `{ fooPage }` in any spec. No fixture code is needed.

**New API endpoint**: add a client in `src/api/` extending `BaseApiClient`, add its schema to `schemas.ts`, register it in `src/fixtures/api.fixtures.ts`, then write specs under `tests/api/`.

## CI

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [ci.yml](.github/workflows/ci.yml) | Push to `main`, pull requests | Run both suites on every change |
| [daily.yml](.github/workflows/daily.yml) | Every day at 06:00 UTC, or manually from the Actions tab | Daily regression run. Manual runs can pick API, UI or both |
| [run-tests.yml](.github/workflows/run-tests.yml) | Called by the two above | Shared job: install, typecheck, lint, test, upload HTML report |

The API and UI suites run as parallel matrix jobs. Only the UI job installs a browser. Each job uploads its HTML report as an artifact.

**Credentials:** the workflow uses the repository secrets `UI_USERNAME`, `UI_PASSWORD`, `API_USERNAME` and `API_PASSWORD` if they are set (Settings → Secrets and variables → Actions). Otherwise it falls back to the public demo accounts. When you point the framework at a real environment, set the secrets.
