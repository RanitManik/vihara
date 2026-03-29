<div align="center">

<img src="logo.png" alt="Vihara Logo" width="70" />

# **Vihara** — Hotel Management Platform

[![GitHub License](https://img.shields.io/github/license/RanitManik/vihara)](https://github.com/RanitManik/vihara/blob/main/LICENSE)
[![GitHub Created At](https://img.shields.io/github/created-at/RanitManik/vihara)](https://github.com/RanitManik/vihara)
[![GitHub repo size](https://img.shields.io/github/repo-size/RanitManik/vihara)](https://github.com/RanitManik/vihara)
[![GitHub stars](https://img.shields.io/github/stars/RanitManik/vihara?style=default)](https://github.com/RanitManik/vihara/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/RanitManik/vihara?style=default)](https://github.com/RanitManik/vihara/network/members)

</div>

Vihara is a comprehensive accommodation booking application that allows users to search, book, and manage hotel reservations. It also includes vendor features, enabling hotel owners to list and manage their properties. The project is structured as an **Nx monorepo**, ensuring seamless code sharing, consistent tooling, and scalable development across the frontend and backend.

<details>
<summary><strong>Table of Contents</strong> (Click to Expand)</summary>

- [**Features**](#-features)
- [**Tech Stack**](#-tech-stack)
- [**Repository Structure**](#-repository-structure)
- [**Getting Started**](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-installation)
  - [Environment Configuration](#2-environment-configuration)
  - [Running the Application](#3-running-the-application)
  - [Database Seeding](#4-database-seeding)
- [**Nx Scripts Reference**](#-nx-scripts-reference)
- [**API Reference**](#-api-reference)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Hotels (Public)](#hotels-public)
  - [Bookings](#bookings)
  - [Vendor Operations (My Hotels)](#vendor-operations-my-hotels)
- [**Data Models**](#-data-models)
- [**Testing**](#-testing)
- [**Deployment**](#-deployment)
- [**Troubleshooting**](#-troubleshooting)
- [**Contribution**](#-contribution)
- [**License**](#-license)

</details>

## ✨ Features

- **User Authentication:** Secure signup, login, and session management using JWT.
- **Hotel Search & Filtering:** Advanced search capabilities by destination, guest count, facilities, star rating, and price.
- **Booking & Payments:** Integrated checkout flow with Stripe for secure payment processing.
- **Property Management:** Dedicated dashboard for hotel owners to add, edit, and remove their listings.
- **Image Management:** Cloudinary integration for optimized hotel image uploads and storage.
- **Robust Testing:** Comprehensive test coverage utilizing Jest for unit tests and Playwright for end-to-end (E2E) testing.

## 🛠 Tech Stack

| Category                      | Technologies                              |
| :---------------------------- | :---------------------------------------- |
| **Frontend**                  | Next.js (App Router), React, Tailwind CSS |
| **Backend**                   | Node.js, Express.js                       |
| **Database & ORM**            | MongoDB, Mongoose                         |
| **Infrastructure & Services** | Cloudinary (Images), Stripe (Payments)    |
| **Monorepo & Tooling**        | Nx, TypeScript, ESLint, Prettier          |
| **Testing**                   | Jest (Unit), Playwright (E2E)             |

## 📂 Repository Structure

The workspace is managed by Nx, separating concerns while maintaining a unified developer experience:

- `api/` — The REST API server (Express + MongoDB).
- `web/` — The frontend application (Next.js).
- `e2e/` — Playwright end-to-end test suite for the web application.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed and configured:

- **Node.js:** v20 or higher
- **Package Manager:** pnpm v9+ (Recommended), npm, or yarn
- **Database:** A running MongoDB instance (local or MongoDB Atlas)
- **External Accounts:** \* [Cloudinary](https://cloudinary.com/) (for image uploads)
  - [Stripe](https://stripe.com/) (for payment processing)

### 1. Installation

Clone the repository and install dependencies from the root directory:

```bash
pnpm install
```

### 2. Environment Configuration

This repo has separate environment files for each app:

- `api/.env` (API server)
- `web/.env` (Next.js frontend)

Both folders include `.env.example` templates; copy them to the same location before running.

#### 2.1 API env (`api/.env`)

```env
# Application
PORT=4000
NODE_ENV=development # development | production | test
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/vihara
MONGODB_URI_E2E=mongodb://localhost:27017/vihara_test # Optional: For E2E testing

# Security
JWT_SECRET_KEY=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Database Seeding (Optional)
SEED_HOTEL_COUNT=100
SEED_USER_ID=seed-user
SEED_RESET=true
```

#### 2.2 Web env (`web/.env`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUB_KEY=your_stripe_publishable_key
```

### 3. Running the Application

Start both the API and Web development servers concurrently:

```bash
pnpm dev
```

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:4000`

### 4. Database Seeding

To populate the database with sample hotels (requires images located in `api/src/assets/hotels`):

```bash
pnpm seed:hotels
```

## 📜 Nx Scripts Reference

Use the following commands from the repository root to manage the monorepo:

| Command          | Description                                     |
| :--------------- | :---------------------------------------------- |
| `pnpm dev`       | Run all development servers concurrently.       |
| `pnpm dev:api`   | Run only the API server.                        |
| `pnpm dev:web`   | Run only the Next.js web application.           |
| `pnpm build`     | Build all projects for production.              |
| `pnpm build:api` | Build the API.                                  |
| `pnpm build:web` | Build the web application.                      |
| `pnpm test`      | Run unit tests across all projects.             |
| `pnpm e2e`       | Run end-to-end tests for all projects.          |
| `pnpm lint`      | Run ESLint across the workspace.                |
| `pnpm format`    | Format all code using Prettier.                 |
| `pnpm typecheck` | Run TypeScript compiler checks on all projects. |

## 🔌 API Reference

**Base URL:** `/api`

### Authentication

- `POST /auth/login` - Authenticate user and set HTTP-only cookie
- `GET /auth/validate-token` - Validate current session (Requires Auth)
- `POST /auth/logout` - Clear authentication cookie

### Users

- `POST /users` - Register a new user
- `GET /users` - List users
- `GET /users/:userId` - Get specific user details
- `PUT /users/:userId` - Update user details
- `DELETE /users/:userId` - Remove a user

### Hotels (Public)

- `GET /hotels` - Fetch all hotels
- `GET /hotels/search` - Search hotels (Accepts queries: `destination`, `adultCount`, `childCount`, `facilities`, `types`, `stars`, `maxPrice`, `sortOption`, `pageNumber`)
- `GET /hotels/:hotelId` - Get details for a specific hotel

### Bookings

- `POST /hotels/:hotelId/bookings/payment-intent` - Initialize Stripe payment (Requires Auth)
- `POST /hotels/:hotelId/bookings` - Confirm and create booking (Requires Auth)
- `GET /my-bookings` - Fetch current user's booked trips (Requires Auth)

### Vendor Operations (My Hotels)

- `GET /my-hotels` - List properties owned by the current user (Requires Auth)
- `POST /my-hotels` - Create a new hotel listing (Requires Auth)
- `PUT /my-hotels/:hotelId` - Update an existing listing (Requires Auth)
- `DELETE /my-hotels/:hotelId` - Delete a listing (Requires Auth)

## 🗄 Data Models

**User**

- `firstName`, `lastName`, `email` (Unique, Indexed), `password` (Hashed)

**Hotel**

- **General:** `name`, `city`, `country`, `address`, `description`, `type`
- **Details:** `adultCount`, `childCount`, `facilities` [Array], `pricePerNight`, `starRating`
- **Media & Meta:** `imageUrls` [Array], `lastUpdated`
- **Relations:** `userId` (Owner reference), `bookings` [Array]

**Booking**

- **Guest Info:** `firstName`, `lastName`, `email`, `adultCount`, `childCount`
- **Reservation:** `checkIn`, `checkOut`, `totalCost`
- **Relations:** `userId` (Guest reference)

## 🧪 Testing

The repository maintains strict quality control through automated testing:

- **Unit Tests:** Run `pnpm test` to execute Jest suites.
- **E2E Tests:** Run `pnpm e2e` to execute the Playwright suite located in `e2e/`. Ensure your local servers are running or your `MONGODB_URI_E2E` is properly configured before running E2E workflows.

## ☁️ Deployment

1.  Provision your hosting environments (e.g., Vercel for Next.js, Railway/Heroku/Render for the Node API).
2.  Set all required environment variables in your hosting provider's dashboard.
3.  Configure your deployment pipelines to execute the specific build commands (`pnpm build:web` and `pnpm build:api`).
4.  Ensure cross-origin resource sharing (CORS) in the API is updated to accept requests from your production frontend URL.

## 🚑 Troubleshooting

- **Database Connection Refused:** Verify that your MongoDB service is running and `MONGODB_URI` contains the correct credentials and database name.
- **Image Upload Failures:** Check that your Cloudinary `CLOUD_NAME`, `API_KEY`, and `API_SECRET` are strictly accurate. Images will fail to seed or upload if these are invalid.
- **Payment Intent Errors:** Ensure the `STRIPE_SECRET_KEY` is a valid test or live key. Verify that the currency logic in your backend matches your Stripe account's default capabilities.

## 🤝 Contribution

Contributions are welcome! To contribute:

1.  Fork the repository.
2.  Create a descriptive feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Ensure all tests and linters pass (`pnpm lint`, `pnpm test`).
5.  Push to the branch (`git push origin feature/amazing-feature`).
6.  Open a Pull Request.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
