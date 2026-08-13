# Ryde

A small React + Vite app for browsing and booking bikes.

## Features

- Browse available bikes with details
- Book a bike using the booking form
- Admin and Dashboard pages (basic UI scaffolding)
- Responsive layout with Tailwind CSS

## Tech stack

- Vite
- React (JSX)
- Tailwind CSS

## Getting started

Prerequisites: Node.js (16+ recommended) and npm or yarn.

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

The app runs at http://localhost:5173 by default (Vite).

Build for production:

```bash
npm run build
npm run preview
```

## Project structure (key files)

- `src/App.jsx` — app entry and routes
- `src/main.jsx` — React mount point
- `src/pages/` — page-level views (Home, Auth, Dashboard, Admin)
- `src/components/` — UI components (BikeCard, BookingForm, Modal, Navbar, etc.)
- `src/services/` — app utilities and mock data
- `src/styles/index.css` — Tailwind entry

## Environment & configuration

This project contains `vercel.json` and is ready to deploy to Vercel. If you deploy, set any needed environment variables in your hosting provider (none are required by default for the demo data).

## Deployment

To deploy to Vercel, connect the repository and use the default build command (`npm run build`). The `vercel.json` file in the repo provides basic configuration.

## Contributing

Contributions are welcome. Open an issue or submit a PR. Keep changes focused and add a short description to the PR.

## License

Add a license if you intend to publish this project.# Ryde
A platform for gig workers

