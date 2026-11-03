# Billing Frontend

React single-page app for the Friends Crackers billing counter. Staff sign in, build a bill from the product list, take payment, and share the bill over WhatsApp.

It talks to the Django API in [`billing_backend`](../billing_backend).

## Tech stack

- React 18, React Router 6
- Vite 5
- Bootstrap 5

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173. Start the backend too (http://127.0.0.1:8000). Vite proxies `/api` requests to it, so no API URL setup is needed in development.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

## Features

- Login screen. The token is stored in the browser, and an expired token returns you to login.
- New order page with search, category filter, quick code entry and a cart sidebar.
- Payment by cash, GPay or split, with a round-off ("less") amount.
- Orders page grouped by date, with details, edit and delete.
- Printable bill view and WhatsApp bill message.

## Project layout

```
src/
  api/          fetch client and token storage
  components/   shared UI (navbar, cart, bill, modals, tables)
  hooks/        useCart, useAsync
  pages/        LoginPage, NewOrderPage, OrdersPage
  styles/       theme.css
  utils/        money/date formatting, WhatsApp message builder
```

## Deployment

`npm run build` produces static files in `dist/`. In production the app calls `/api` on its own origin, so serve it behind a proxy that forwards `/api` to the backend, or add the frontend's origin to `CORS_ALLOWED_ORIGINS` in the backend settings.
