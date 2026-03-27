# Vihara (Hotel Booking Platform)

A full-stack hotel booking application built with Nx monorepo.

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Stripe, Cloudinary
- Frontend: Next.js (App Router), React, Tailwind CSS
- E2E: Playwright
- Monorepo tooling: Nx, TypeScript, Jest, ESLint, Prettier

## Repository layout

- `api/` - REST API server (Express + MongoDB)
- `web/` - frontend (Next.js)
- `web-e2e/` - Playwright end-to-end tests

## Requirements

- Node.js 20+ (or compatible)
- pnpm 9+ / npm / yarn (pnpm recommended)
- MongoDB instance (local or cloud)
- Cloudinary account for image upload (seed + hotel images)
- Stripe account for payments

## Quick start

1. Install dependencies

```bash
pnpm install
```

2. Create `.env` in repository root (or copy `.env.example` if exists)

Required variables:

- `PORT` (default 4000)
- `NODE_ENV` (`development`, `production`, `test`)
- `FRONTEND_URL` (e.g. `http://localhost:3000`)
- `MONGODB_URI` (production/dev DB)
- `MONGODB_URI_E2E` (optional, for tests)
- `JWT_SECRET_KEY` (strong secret)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `SEED_HOTEL_COUNT` (optional, default `100`)
- `SEED_USER_ID` (optional, default `seed-user`)
- `SEED_RESET` (`true` to clear and seed)

3. Start local development

```bash
pnpm dev
```

This runs both API and web in parallel:
- API on `http://localhost:4000`
- Web on `http://localhost:3000`

4. Seed hotel data (images in `api/src/assets/hotels`)

```bash
pnpm seed:hotels
```

## Nx scripts

- `pnpm build` - build all projects
- `pnpm build:api` - build API
- `pnpm build:web` - build web
- `pnpm dev` - run all dev servers
- `pnpm dev:api` - run API server
- `pnpm dev:web` - run web app
- `pnpm test` - run all tests
- `pnpm test:api` - run API tests
- `pnpm test:web` - run frontend tests
- `pnpm lint` - lint all projects
- `pnpm format` - format all code
- `pnpm e2e` - run e2e tests for all projects
- `pnpm e2e:web` - run `web-e2e`
- `pnpm typecheck` - typecheck all projects

## API overview

Base URL: `/api`

### Auth
- `POST /api/auth/login`
- `GET /api/auth/validate-token` (requires auth cookie)
- `POST /api/auth/logout`

### Users
- `POST /api/users` (sign up)
- `GET /api/users` (list users)
- `GET /api/users/:userId`
- `PUT /api/users/:userId`
- `DELETE /api/users/:userId`

### Hotels
- `GET /api/hotels` (all hotels)
- `GET /api/hotels/search` (query params: destination, adultCount, childCount, facilities, types, stars, maxPrice, sortOption, pageNumber)
- `GET /api/hotels/:hotelId`

### Hotel bookings
- `POST /api/hotels/:hotelId/bookings/payment-intent` (requires JWT cookie)
- `POST /api/hotels/:hotelId/bookings` (requires JWT cookie)

### My Hotels (owner operations)
- `GET /api/my-hotels` (requires JWT cookie)
- `POST /api/my-hotels` (add a new hotel)
- `PUT /api/my-hotels/:hotelId`
- `DELETE /api/my-hotels/:hotelId`

### My Bookings
- `GET /api/my-bookings` (requires JWT cookie)

## Data models

### User
- `firstName`, `lastName`, `email` (unique), password (hashed)

### Hotel
- `userId` (owner), `name`, `city`, `country`, `address`, `description`, `type`, `adultCount`, `childCount`
- `facilities` array
- `pricePerNight`, `imageUrls`, `starRating`, `lastUpdated`
- `bookings` array of objects

### Booking
- `firstName`, `lastName`, `email`, `adultCount`, `childCount`, `checkIn`, `checkOut`, `userId`, `totalCost`

## Frontend app

Located in `web/` as Next.js with:
- `src/app` pages, including hotel details, search, add/edit hotel, my bookings, my hotels, auth
- Reusable components in `src/components/`
- API client in `src/lib/api-client.ts`

## Testing

- Unit tests: Jest configs in root
- E2E: Playwright under `web-e2e/`

Run tests:

```bash
pnpm test
pnpm e2e
```

## Deployment

1. Set environment variables in your host service (Heroku, Vercel, Railway, etc.)
2. Build the API (`pnpm build:api`) and web (`pnpm build:web`) as per platform requirements.
3. Ensure MongoDB, Cloudinary, and Stripe keys are configured.

## Troubleshooting

- Ensure `MONGODB_URI` is reachable and has the correct credentials.
- Confirm Cloudinary credentials are valid before seeding or uploading images.
- For Stripe failures, check `STRIPE_SECRET_KEY` and the currency logic in hotel booking payment intent route.

## Contribution

1. Fork repository
2. Create feature branch
3. Add tests where needed
4. Open PR

## License

MIT
