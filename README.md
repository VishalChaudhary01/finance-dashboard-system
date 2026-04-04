# Finance Dashboard System

A backend system for managing financial records with role-based access control, built with Node.js, TypeScript, Express, Prisma ORM, and PostgreSQL.

### Postman Docs: https://documenter.getpostman.com/view/23177151/2sBXiqDU7E

## Tech Stack

| Layer            | Choice                    |
| ---------------- | ------------------------- |
| Runtime          | Node.js                   |
| Language         | TypeScript                |
| Framework        | Express                   |
| ORM              | Prisma                    |
| Database         | PostgreSQL                |
| Validation       | Zod                       |
| Auth             | JWT via HTTP-only cookies |
| Password hashing | bcrypt                    |

## Prerequisites

Make sure the following are installed on your machine:

- [Node.js 22+](https://nodejs.org)
- [npm 10+](https://www.npmjs.com)
- [PostgreSQL 17](https://www.postgresql.org/download/)
- [Git](https://git-scm.com)

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/VishalChaudhary01/finance-dashboard-system.git
cd finance-dashboard-system
```

### 2. Install dependencies

```bash
npm install
```

### Copy the example env file into .env

```bash
cp .env.example .env
```

> Update DATABASE_URL with your`s.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Seed the database

This creates the default ADMIN user:

```bash
npx prisma db seed
```

Default admin credentials:

```
Email:    admin@finance.com
Password: Admin@1234
```

### 7. Start the development server

```bash
npm run dev
```

Server will be available at: `http://localhost:5000`

## API Overview

All routes are prefixed with `/api/v1`. Authentication uses HTTP-only cookies — sign in first and the cookie is set automatically.

### Auth

| Method | Route           | Access        | Description                     |
| ------ | --------------- | ------------- | ------------------------------- |
| `POST` | `/auth/signup`  | Public        | Register as VIEWER              |
| `POST` | `/auth/signin`  | Public        | Sign in and receive auth cookie |
| `POST` | `/auth/signout` | Authenticated | Clear auth cookie               |

### Users

| Method  | Route        | Access | Description                |
| ------- | ------------ | ------ | -------------------------- |
| `GET`   | `/users`     | Admin  | List all users             |
| `GET`   | `/users/:id` | Admin  | Get user by ID             |
| `POST`  | `/users`     | Admin  | Create user with any role  |
| `PATCH` | `/users/:id` | Admin  | Update user role or status |

### Financial Records

| Method   | Route          | Access          | Description                              |
| -------- | -------------- | --------------- | ---------------------------------------- |
| `GET`    | `/records`     | Admin & Analyst | List records with filters and pagination |
| `GET`    | `/records/:id` | Admin & Analyst | Get single record                        |
| `POST`   | `/records`     | Admin           | Create a new record                      |
| `PATCH`  | `/records/:id` | Admin           | Update a record                          |
| `DELETE` | `/records/:id` | Admin           | Soft delete a record                     |

**Available query filters for `GET /records`:**

| Param       | Type                  | Example                               |
| ----------- | --------------------- | ------------------------------------- |
| `page`      | number                | `?page=1`                             |
| `limit`     | number                | `?limit=10`                           |
| `type`      | `INCOME` or `EXPENSE` | `?type=INCOME`                        |
| `category`  | string                | `?category=Shop`                      |
| `startDate` | ISO 8601              | `?startDate=2026-01-01T00:00:00.000Z` |
| `endDate`   | ISO 8601              | `?endDate=2026-12-31T00:00:00.000Z`   |

### Dashboard

| Method | Route                        | Access          | Description                                |
| ------ | ---------------------------- | --------------- | ------------------------------------------ |
| `GET`  | `/dashboard`                 | Public          | All dashboard data in one request          |
| `GET`  | `/dashboard/summary`         | Admin & Analyst | Total income, expenses, net balance        |
| `GET`  | `/dashboard/category-totals` | Admin & Analyst | Totals grouped by category and type        |
| `GET`  | `/dashboard/recent-activity` | Admin & Analyst | Latest 10 records with creator info        |
| `GET`  | `/dashboard/monthly-trends`  | Admin & Analyst | Income vs expense per month (`?year=2026`) |
| `GET`  | `/dashboard/weekly-trends`   | Admin & Analyst | Income vs expense for last 7 days          |

---

## Assumptions and Design Decisions

**Single workspace** — The task does not mention multi-tenancy or organizations. All users share one system, differentiated only by role.

**Create ADMIN User** — Run `npx prisma db seed` to create ADMIN user.

**Public signup creates VIEWER** — Anyone can self-register and access the dashboard in read-only mode. Role elevation requires an Admin.

**Soft delete for financial records** — Financial data is never hard-deleted. Records are flagged with `isDeleted: true` to preserve audit history, which is standard practice for finance systems.

**Cookie-based auth over Authorization header** — HTTP-only cookies prevent XSS attacks from accessing the token via JavaScript. This is more secure for browser-based dashboard clients.

**Inactive user check on every request** — The `verifyAuth` middleware fetches the user from the database on each request. This ensures a deactivated user's existing JWT is immediately rejected, not just on next login. The minor performance overhead is acceptable for a finance system where security matters.

**Promise.all for dashboard aggregation** — All five dashboard queries run in parallel, not sequentially. This minimizes response time for the combined/dashboard endpoint.

**$queryRaw for trend queries** — Prisma's groupBy does not support date truncation functions like EXTRACT and DATE. Raw SQL is used intentionally here for monthly and weekly grouping, not as a workaround.

**Prisma omit** — passwordHash is excluded at the query level using Prisma's omit option rather than a post-processing utility. This ensures the hash is never accidentally included in any response.

**Pagination defaults** — Records default to `page=1, limit=10` if not specified.
