# React RTK B2B Demo

A B2B e-commerce demo application built with React 19, Redux Toolkit, and RTK Query. It showcases a product catalog, shopping cart with optimistic updates, JWT authentication, and internationalization — all powered by the [DummyJSON](https://dummyjson.com) public API.

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4, shadcn/ui (Radix Nova), Lucide icons |
| State | Redux Toolkit, RTK Query, redux-persist |
| Routing | React Router 7 |
| i18n | i18next (English, Hungarian) |
| Toasts | Sonner |
| Testing | Vitest, Testing Library, jsdom |

## Features

- **Product Catalog** — browse, search, and filter products by category with paginated results
- **Shopping Cart** — add products, adjust quantities, and view subtotals with optimistic RTK Query mutations
- **Authentication** — JWT login via DummyJSON `/auth/login`; access + refresh tokens persisted to `localStorage`; on `401`, silent `/auth/refresh` retry before logout; protected routes for dashboard, cart, and profile
- **Guest Browsing** — catalog is accessible without login; cart actions require authentication
- **Dark / Light Theme** — toggle stored in `localStorage`
- **Internationalization** — English (`en-US`) and Hungarian (`hu-HU`) language support
- **Responsive Layout** — mobile-friendly navigation drawer with sheet overlay

## Project Structure

```
src/
├── app/                  # Router, layouts (Root, Protected), providers
├── components/
│   ├── shared/           # AppNavbar, NavigationDrawer, ThemeToggle
│   └── ui/               # shadcn primitives (button, card, input, table, …)
├── config/               # Navigation items
├── features/
│   ├── auth/             # LoginForm, useLogin hook
│   ├── cart/             # CartManager, CartItemRow, quantity controls
│   └── catalog/          # ProductCatalog, ProductRow, AvailabilityBadge
├── hooks/                # useRootLayout, useTheme
├── i18n/                 # i18next config and translation resources
├── lib/                  # Utility helpers (cn)
├── pages/                # Route-level page components
├── store/                # Redux store, slices (auth, cartDraft), RTK Query API
├── test/                 # Vitest setup and unit tests
└── types/                # DummyJSON type definitions
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** (or any compatible package manager)

### Installation

```bash
git clone https://github.com/Thazulk/react-rtk-b2b-demo.git
cd react-rtk-b2b-demo
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
npm run preview   # preview the production build locally
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test          # watch mode
npm run test:run  # single run
```

## API

All data comes from [DummyJSON](https://dummyjson.com). The RTK Query API slice (`src/store/dummyJsonApi.ts`) defines endpoints for authentication, products, categories, and carts. A bearer token obtained at login is automatically attached to requests via `prepareHeaders`.

## License

This project is provided for demo and educational purposes.
