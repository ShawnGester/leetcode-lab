# LeetCode Lab

Offline LeetCode practice app built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Pick one of four bundled problems, write JavaScript in the browser, run custom test cases in a local sandbox, and review optimal / brute-force solutions — no LeetCode API required.

## Problems included

1. **33.** Search in Rotated Sorted Array  
2. **153.** Find Minimum in Rotated Sorted Array  
3. **200.** Number of Islands  
4. **417.** Pacific Atlantic Water Flow  

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## How to use

- **Problem selector** (navbar) — switch among the four bundled problems  
- **Practice** — Monaco editor + editable test cases + Run / Reset  
- **Optimal / Brute Force** — read-only solutions with time/space notes  
- Test args are a **JSON array** of function parameters; expected is **JSON**  

Code runs entirely in the browser (Web Worker + timeout). Nothing is sent to a server.

## Project layout

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router entry |
| `src/components/practice-app.tsx` | Main IDE shell |
| `src/components/code-editor.tsx` | Monaco editor wrapper |
| `src/lib/problems/` | Offline problem statements, starters, samples, solutions |
| `src/lib/runner.ts` | Sandboxed test runner |
| `src/components/ui/` | shadcn/ui primitives |
