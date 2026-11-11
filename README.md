# Fleet Manager – SE411 Project

A React + Spring Boot application for managing a company's **cars**: add, search by id, list with
pagination, update and delete cars. Part 1 is the React frontend, Part 2 is the Spring Boot backend.



## Team

| Name                | Student ID |
| ------------------- | ---------- |
| Reema Alnasser      | 223410003  |
| Sarah Almuhaini     | 222511391  |
| Aljoharah Alqahtani | 221511429  |

## Project structure

```
SE411-PhaseOne/
├── frontend/   React app (Vite) – Part 1, now connected to the backend
└── backend/    Spring Boot server (Maven, Eclipse) – Part 2
```

## Getting started

### 1. Backend (Spring Boot)

Requirements: Java 17+ and Eclipse IDE for Enterprise Java and Web Developers.

1. In Eclipse: **File → Import → Maven → Existing Maven Projects** → choose the `backend` folder.
2. Right-click `pom.xml` → **Run As → Maven build…** → goal: `clean spring-boot:run`.
3. The server starts on http://localhost:8080 with 8 sample cars (from `data.sql`).

Run the unit tests: right-click `pom.xml` → **Run As → Maven test**.

### 2. Frontend (React)

Requirements: [Node.js](https://nodejs.org/) 20 or newer.

```bash
cd frontend
npm install
npm run dev        # open http://localhost:5173
```

Keep the backend running at the same time, the frontend gets its data from it.

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start the development server   |
| `npm test`      | Run the frontend tests         |
| `npm run build` | Build for production (`dist/`) |

## REST API

| DB Operation | Route | HTTP Method | HTTP Response codes |
| --- | --- | --- | --- |
| Add a new car | `/api/v1/cars` + JSON object in body | POST | 201: created + location in response header<br>400: plate number already used |
| Search a car by id | `/api/v1/cars/{id}` | GET | 200: success<br>404: not found |
| Search all cars (paginated) | `/api/v1/cars?page=0&size=5` | GET | 200: success |
| Update a car | `/api/v1/cars/{id}` + JSON object with new values in body | PUT | 204: no content (success)<br>404: not found<br>400: plate number already used |
| Delete a car | `/api/v1/cars/{id}` | DELETE | 204: no content (success)<br>404: not found |

## Architecture

```
React (frontend) ──HTTP/JSON──► CarController ──► CarService ──► CarRepository ──► H2 database
   localhost:5173                 (REST API)       (logic)        (Spring Data JDBC)   (in memory)
```

## Features

- Navigation menu (Cars · Add Car · About)
- List all cars with pagination (5 per page)
- Search a car by its ID
- Add and edit cars with form validation
- Unique plate numbers checked by the backend
- Delete cars with confirmation
- About page with team members

## Documentation

- [Requirements](docs/requirements.md)
- [Architecture, tech stack and features](docs/architecture.md)

## Tech stack

**Frontend:** React 18 · Vite 6 · React Router 6 · Vitest + React Testing Library

**Backend:** Java 17 · Spring Boot 4 · Spring Web · Spring Data JDBC · H2 · JUnit 5 + Mockito

## Validation Review

The project requirements specify that each car must have a unique plate number. Before finalizing the application, verify that adding a car with an existing plate number is rejected and that a clear error message is displayed.

Related review: Issue #1.
