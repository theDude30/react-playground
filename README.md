# react-playground

Minimal, extendable React + TypeScript starter for interviews, take-home assignments, and quick tests.

**Stack:** Vite • React 18 • TypeScript • Vitest • React Testing Library • ESLint • Prettier • React Router

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

## Scripts

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Start dev server with HMR                   |
| `npm run build`    | Type-check and build for production         |
| `npm run preview`  | Preview the production build                |
| `npm test`         | Run tests in watch mode                     |
| `npm run test:run` | Run tests once (CI mode)                    |
| `npm run lint`     | Lint with ESLint                            |
| `npm run format`   | Format all files with Prettier              |

## Project structure

```
src/
├── main.tsx              # React root + router provider
├── App.tsx               # Renders the route table
├── routes.tsx            # Central route table — add a page here
├── index.css             # Global styles
│
├── pages/                # One folder per route
│   └── Home/
│       ├── Home.tsx
│       ├── Home.test.tsx
│       └── index.ts
│
├── components/           # Reusable presentational components
├── hooks/                # Custom React hooks
├── lib/                  # Framework-agnostic utilities
├── types/                # Shared TypeScript types
├── assets/               # Imported images, svgs, etc.
└── test/
    ├── setup.ts          # Vitest + jest-dom setup
    └── utils.tsx         # renderWithRouter() and re-exports
```

## How to extend

### Add a page

1. Create `src/pages/About/About.tsx`, `About.test.tsx`, `index.ts`.
2. Add a line to `src/routes.tsx`:

```tsx
import { About } from '@/pages/About';

export const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
];
```

### Add a component

```
src/components/Button/Button.tsx
src/components/Button/Button.test.tsx
src/components/Button/index.ts   // export { Button } from './Button';
```

### Add a hook

```
src/hooks/useCounter.ts
src/hooks/useCounter.test.ts
```

### Add a utility

```
src/lib/formatDate.ts
src/lib/formatDate.test.ts
```

## Imports

Use the `@/` alias for anything under `src/`:

```ts
import { Home } from '@/pages/Home';
import { useCounter } from '@/hooks/useCounter';
```

## Testing

Tests are co-located next to the file they cover (`Foo.tsx` ↔ `Foo.test.tsx`). Vitest picks up any `*.test.{ts,tsx}` file under `src/`.

Use `renderWithRouter` from `@/test/utils` when testing components that depend on routing.
