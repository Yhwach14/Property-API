# Property Listing API

A REST API for a property rental listing app — scoped down to what's needed to browse, filter, and manage listings. Built as a hands-on project to learn backend development with NestJS.

A companion [Flutter app](https://github.com/Yhwach14/Property-App) consumes this API end to end: browsing, filtering, auth, and an owner-facing flow for creating, editing, and photographing listings.

## Why this project

Firebase handles auth, file storage, and database access invisibly. This project exists to build every one of those pieces by hand instead: real JWT auth with role-based access, a PostgreSQL schema managed through migrations (not an ORM's auto-sync), file uploads validated by actual file content, and a consistent error contract across every endpoint.

## Features

- **Property listings** — apartments, villas, motels, cabins, and more, each with price, location, amenities, and photos
- **Browse, filter, search** — by type, city, price range, bedroom count, amenity set, and free-text search, all paginated
- **Role-based auth** — `USER` → `OWNER` → `ADMIN`, with JWT access tokens and argon2 password hashing. Self-registration creates a plain `USER`; an admin promotes someone to `OWNER` before they can list anything, which is closer to how a real platform gates hosting
- **Owner listing management** — create, edit, publish/unpublish, and soft-delete, scoped so an owner can only touch their own listings (admins can touch any)
- **Photo uploads** — multipart upload with file-type validation by magic bytes (not filename or `Content-Type`, which are easy to fake), a cover-image selector enforced at the database level, and reordering
- **Consistent error contract** — every error, from every endpoint, comes back as `{ error: { code, message, details? } }`
- **API documentation** — live Swagger UI, generated from the same decorators that validate requests

## Tech stack

- **NestJS** (TypeScript) — REST API, dependency injection, guards, pipes
- **PostgreSQL** + **TypeORM** — schema managed entirely through migrations, `synchronize` disabled
- **Passport + JWT** — authentication, with a role-based authorization guard
- **argon2** — password hashing
- **class-validator** / **class-transformer** — request validation at the controller boundary
- **Multer** — multipart file uploads, held in memory for magic-byte inspection before anything touches disk
- **Swagger** (`@nestjs/swagger`) — auto-generated, interactive API docs

## Getting started

### Prerequisites

- Node.js 18+
- A local PostgreSQL instance (no Docker dependency — this runs against a plain local install)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your local Postgres credentials:

```
DATABASE_URL=postgres://postgres:<your-password>@localhost:5432/property_api
PORT=3000
JWT_SECRET=<a long random string>
PUBLIC_BASE_URL=http://localhost:3000
UPLOAD_DIR=uploads
```

Create the database:

```sql
CREATE DATABASE property_api;
```

### 3. Run migrations

```bash
npm run migration:run
```

### 4. Seed sample data (optional, but makes the API worth looking at)

```bash
npm run seed
```

Creates 12 amenities, ~25 properties across 6 cities (apartments, villas, motels, cabins), and two accounts:

| Role | Email | Password |
|---|---|---|
| Owner | `owner@example.com` | `Owner12345!` |
| Admin | `admin@example.com` | `Admin12345!` |

The seed is idempotent — running it again won't duplicate anything.

### 5. Run the app

```bash
npm run start:dev
```

API is live at `http://localhost:3000/api/v1`. Interactive docs at `http://localhost:3000/api/docs`.

## NPM scripts

| Script | What it does |
|---|---|
| `npm run start:dev` | Run the app with hot reload |
| `npm run build` | Compile TypeScript, checking for type errors |
| `npm run migration:generate -- <path>` | Generate a migration from entity changes |
| `npm run migration:create -- <path>` | Scaffold an empty migration file |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Roll back the last migration |
| `npm run seed` | Populate the database with sample data |

## Authentication and roles

Three roles, deliberately not granted equally:

- **`USER`** — the default on self-registration. Can browse and authenticate, nothing more.
- **`OWNER`** — can create, edit, and delete their own listings. Not self-assignable — an admin grants it via `PATCH /users/:id/role`.
- **`ADMIN`** — full access, including managing any listing and promoting users. Seeded, not self-registerable.

Authenticate with `POST /auth/login`, then send the returned `accessToken` as `Authorization: Bearer <token>` on any protected route. Wrong email and wrong password return an identical 401 on purpose, so the API never reveals which emails are registered.

## API overview

Full interactive docs live at `/api/docs` once the app is running. Summary:

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/health` | public | |
| GET | `/amenities` | public | |
| POST | `/amenities` | admin | |
| GET | `/properties` | public | Filterable, sortable, paginated |
| GET | `/properties/:id` | public | Published listings only |
| POST | `/properties` | owner/admin | Owner is taken from the token |
| PATCH | `/properties/:id` | owner of it / admin | Partial update |
| DELETE | `/properties/:id` | owner of it / admin | Soft delete |
| GET | `/me/properties` | owner/admin | Includes drafts |
| GET | `/me/properties/:id` | owner of it / admin | Includes drafts |
| POST | `/properties/:id/images` | owner of it / admin | `multipart/form-data`, field `file` |
| PATCH | `/properties/:id/images/:imageId` | owner of it / admin | Set cover, reorder |
| DELETE | `/properties/:id/images/:imageId` | owner of it / admin | |
| POST | `/auth/register` | public | |
| POST | `/auth/login` | public | |
| GET | `/auth/me` | authenticated | |
| PATCH | `/users/:id/role` | admin | Promote a user to `OWNER` |

`GET /properties` supports `page`, `pageSize`, `type`, `city`, `minPrice`, `maxPrice`, `bedrooms`, `amenities` (comma-separated slugs, matches **all**), `q` (free-text search), `sortBy`, and `sortOrder`.
