# Booking API

A production-style REST API built with Node.js, Express, PostgreSQL, and Prisma.

This project focuses on backend fundamentals: authentication, authorization, clean architecture, and testable business logic.

## Key Features

- JWT-based authentication (login/register)
- Role-based access control (`user`, `admin`)
- Booking CRUD with ownership enforcement
- Centralized error handling
- Service-based architecture (controllers vs business logic separation)
- Integration tests using Vitest + Supertest

## Architecture

The API follows a layered structure:

- **Routes** → define endpoints
- **Controllers** → handle HTTP request/response
- **Services** → contain business logic
- **Middleware** → authentication, authorization, error handling
- **Prisma** → database access layer

This separation keeps the code maintainable and testable.

## Example Flow

1. User registers and receives a JWT
2. Token is used to access protected routes
3. User creates bookings tied to their account
4. Ownership checks ensure users can only modify their own data
5. Admin users can access all bookings

## Tech Stack

- Node.js + Express
- PostgreSQL + Prisma
- JWT (authentication)
- bcrypt (password hashing)
- Vitest + Supertest (testing)

## Run Locally

```bash
npm install
npx prisma migrate dev
npm run dev