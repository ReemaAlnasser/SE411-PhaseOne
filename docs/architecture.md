# Architecture – Fleet Manager

SE411 Project · Part 1 · Fall 2026–27

## 1. Technology stack

| Concern            | Technology                                   |
| ------------------ | -------------------------------------------- |
| UI library         | React 18 (function components + hooks)       |
| Build tool / dev   | Vite 6                                       |
| Routing            | React Router 6                               |
| State management   | React Context + `useState`                   |
| Styling            | Plain CSS (`src/index.css`)                  |
| Testing            | Vitest 3, React Testing Library, user-event, jsdom |
| Language           | JavaScript (ES modules, JSX)                 |
| Version control    | Git + GitHub                                 |

## 2. High-level architecture

```
┌──────────────────────────────── Browser ────────────────────────────────┐
│                                                                          │
│  main.jsx ── BrowserRouter ── CarProvider (context) ── App               │
│                                     │                   │                │
│                                     │            NavBar + Routes         │
│                                     │                   │                │
│                       cars state ◄──┴──── useCars() ── Pages             │
│                (seeded from data/cars.js)                                │
└──────────────────────────────────────────────────────────────────────────┘
```

In Part 2 only the inside of `CarProvider` changes: its functions will call the Spring Boot
REST API instead of updating the local array. Pages and components stay the same.

## 3. Project structure

```
src/
├── main.jsx                 # Entry point: router + provider + App
├── App.jsx                  # Layout (NavBar, main, footer) and route table
├── index.css                # Global styles
├── data/
│   └── cars.js              # Seed data, status and fuel-type lists
├── context/
│   └── CarContext.jsx       # CarProvider + useCars() hook (CRUD logic)
├── components/
│   ├── NavBar.jsx           # Main menu
│   ├── CarForm.jsx          # Shared add/edit form + validateCar()
│   └── StatusBadge.jsx      # Coloured status pill
├── pages/
│   ├── CarList.jsx          # /cars – table, search, filter, delete
│   ├── AddCar.jsx           # /cars/new
│   ├── EditCar.jsx          # /cars/:id/edit
│   ├── CarDetails.jsx       # /cars/:id
│   ├── About.jsx            # /about – team members
│   └── NotFound.jsx         # fallback route
├── test/
│   ├── setup.js             # jest-dom matchers, cleanup
│   └── renderWithProviders.jsx
└── __tests__/
    ├── CarContext.test.jsx
    ├── CarForm.test.jsx
    └── App.test.jsx
```

## 4. Component tree

```
App
├── NavBar
└── Routes
    ├── CarList ── StatusBadge
    ├── AddCar ─── CarForm
    ├── EditCar ── CarForm
    ├── CarDetails ── StatusBadge
    ├── About
    └── NotFound
```

## 5. State management

All car data lives in one place, `CarProvider` (`src/context/CarContext.jsx`):

| Function               | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `cars`                 | Current array of car objects                            |
| `addCar(car)`          | Assigns the next id and appends the car; returns it     |
| `updateCar(id, changes)` | Merges changes into the car with that id (id kept)    |
| `deleteCar(id)`        | Removes the car with that id                            |
| `getCar(id)`           | Returns one car, or `undefined`                         |

Components read and change data only through the `useCars()` hook, so no page touches
the array directly. State is immutable: every change creates a new array, which makes
React re-render the affected pages.

The form keeps its own local state (controlled inputs) and only passes a clean, validated
object to `onSubmit`. Validation lives in the pure function `validateCar()`, which makes it
easy to unit-test.

## 6. Features

1. **Menu** – NavBar on every page with active-link highlighting.
2. **Display** – table of all cars plus a details page per car.
3. **Add** – validated form (required fields, year range, non-negative mileage, unique plate).
4. **Update** – same form in edit mode, pre-filled.
5. **Remove** – delete from the list or details page, with a confirmation dialog.
6. **Search & filter** – text search and status filter on the list.
7. **About** – team members with student IDs.
8. **404 page** – for unknown routes and unknown car ids.

## 7. Testing

`npm test` runs 24 automated tests with Vitest:

| File                   | What it covers                                                  |
| ---------------------- | --------------------------------------------------------------- |
| `CarContext.test.jsx`  | add / update / delete / get logic and id generation             |
| `CarForm.test.jsx`     | validation rules, error messages, submit, edit pre-fill, cancel |
| `App.test.jsx`         | menu, About page, full add/edit/delete/search flows, 404        |

## 8. AI usage

As required by the project brief, we used an AI assistant to help with the requirements,
the visual design, the frontend code, the tests and this documentation. We reviewed and
tested everything it produced and made changes where needed.
