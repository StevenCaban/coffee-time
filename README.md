# Coffee Time

A minimal coffee/tea/beer/anything brewing timer focused on simplicity and repeatability. Record your brew steps with a stopwatch type interface, save them as named recipes, then replay any brew with a guided countdown.

![hero](src/assets/hero.svg)

## Features

- **Record** — Start a brew and tap "New Step" at each step. Tap stop when finished.
- **Save** — Name your brew, add details (dose, water, temperature), and label each step.
- **Replay** — Select a saved brew and follow along step-by-step with a countdown timer.
- **Edit** — Update brew name, details, or step labels and notes at any time.
- **Export / Import** — Back up individual brews or your full list as JSON files to move devices or to share with other users.
- **Offline-first** — All data lives in `localStorage`; no account required.

## Getting Started

The app is hosted and fully useable at [https://stevencaban.github.io/coffee-time/](https://stevencaban.github.io/coffee-time/)

If you would like to self host, clone the repo then run...

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

## Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- React CSS Modules

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
