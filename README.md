# Coffee Time

A minimal pour-over coffee timer built with React. Record your brew steps with a stopwatch, save them as named recipes, then replay any brew with a guided countdown.

![hero](src/assets/hero.png)

## Features

- **Record** — Start a stopwatch and tap "New Step" at each pour. Stop when done.
- **Save** — Name your brew, add details (dose, water, temperature), and label each step.
- **Replay** — Select a saved brew and follow along step-by-step with a countdown timer.
- **Edit** — Update brew name, details, or step labels and notes at any time.
- **Export / Import** — Back up individual brews or your full list as JSON files.
- **Offline-first** — All data lives in `localStorage`; no account or server required.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- CSS Modules

## Project Structure

```
src/
  components/
    BrewListScreen   — saved brews list with import/export
    StopwatchScreen  — record a new brew
    EditScreen       — name and annotate a brew's steps
    CountdownScreen  — guided replay of a saved brew
  hooks/
    useStopwatch     — stopwatch state machine
    useCountdown     — countdown state machine
  storage.js         — localStorage read/write
  importExport.js    — JSON export and import helpers
  utils.js           — time formatting helpers
```
