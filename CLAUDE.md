# lazyinvestor — Claude Context

## Project Overview

A web app that tracks the performance of any stock/ETF ticker (e.g. SMH).

**Inputs:** ticker symbol, starting investment amount, start date
**Outputs:** interactive performance chart + current profit/loss summary

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Market data:** `yahoo-finance2`
- **Charting:** Recharts
- **Styling:** Tailwind CSS
- **Package manager:** npm
- **Testing:** Jest + React Testing Library

---

## Project Structure

```
/app
  page.tsx              # Main tracker page (organism assembly)
  /api/                 # Route handlers for server-side data fetching
/components
  /atoms                # Smallest building blocks — no business logic
    Button.tsx
    Input.tsx
    Label.tsx
    Badge.tsx
  /molecules            # Compositions of atoms with a single responsibility
    FormField.tsx       # Label + Input
    StatCard.tsx        # Label + value display
  /organisms            # Complex sections composed of molecules/atoms
    TickerForm.tsx      # Full input form (ticker, start date, amount)
    PnLSummary.tsx      # Profit/loss display card
    Chart.tsx           # Performance line chart
  /templates            # Page-level layout shells (no data, just structure)
    TrackerLayout.tsx
/lib
  finance.ts            # Price fetching and P&L calculations
  utils.ts              # Date and number formatting helpers
/types
  index.ts              # Shared TypeScript types
```

### Atomic Design Rules

- **Atoms** — single HTML element wrappers or minimal primitives; no business logic, no data fetching
- **Molecules** — combine 2–3 atoms into a self-contained UI unit; still no business logic
- **Organisms** — feature-level components; may receive domain data as props but do not fetch it themselves
- **Templates** — layout-only; accept children/slots, define page skeleton
- **Pages** — Next.js `page.tsx` files; only place where data fetching and state orchestration happen
- A component must never import from a higher level (atoms cannot import molecules, etc.)
- Keep each component in its own file; co-locate its types if they are not shared

---

## Code Style & Conventions

- TypeScript strict mode — no `any` types (use `unknown` if needed)
- Named exports only; default exports only for Next.js pages/layouts
- `const` over `let`; never use `var`
- Tailwind classes for styling — no inline styles
- All financial calculation logic lives in `/lib/finance.ts`, never in components
- ESLint + Prettier enforced — do not suppress lint errors without a reason

---

## Testing Guidelines

- Unit test all logic in `/lib/finance.ts` thoroughly
- Component tests for `TickerForm` and `PnLSummary`
- Mock `yahoo-finance2` in tests — do not make real network calls
- Run tests: `npm test`

---

## Git & Workflow

- Branch naming: `feature/<name>` or `fix/<name>` off `main`
- Commit style: Conventional Commits
  - `feat:` new functionality
  - `fix:` bug fixes
  - `chore:` tooling, deps, config
  - `test:` test additions/changes
  - `docs:` documentation only
- Never commit directly to `main`
- Keep commits small and focused on one concern

---

## What to Avoid

- Don't add features beyond what's described in the task
- Don't use `any` types
- Don't add comments that just restate what the code does
- Don't mock financial data in production code paths
- Don't over-engineer — prefer simple, direct solutions
