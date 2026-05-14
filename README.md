# Bangalore Smart-Toll System

A full-stack smart toll management platform for Bangalore built with React, TypeScript, Vite, Express, MongoDB Atlas, and Zustand. The system supports authenticated user and admin flows, live toll calculations, transaction persistence, fleet analytics, and PDF audit exports.

## Overview

This repository contains a production-oriented toll operations workflow:

- User login with persisted session state
- Admin login and protected dashboard access
- Live toll fare calculation with vehicle-class pricing
- MongoDB-backed transaction storage and retrieval
- Real-time user activity and admin analytics
- 7-day PDF audit report export for admin review

## Project Structure

- `client/` - React + Vite frontend
- `server/` - Express + MongoDB backend
- `src/` - Legacy/shared backend entry points kept for compatibility

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand, Framer Motion
- Backend: Node.js, Express, Mongoose, MongoDB Atlas, Helmet, CORS
- Utilities: Axios, React Hot Toast, Lucide Icons, jsPDF, jspdf-autotable

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A MongoDB Atlas connection string

## Environment Setup

Create `server/.env` with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_secret
```

## Installation

Install dependencies separately for the client and server:

```bash
cd client
npm install

cd ../server
npm install
```

## Running Locally

Start the backend first:

```bash
cd server
npm run dev
```

Then start the frontend in a second terminal:

```bash
cd client
npm run dev
```

The app is expected to run on:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Features

### User Experience

- Vehicle-based login and persisted authentication
- Live activity feed for the signed-in vehicle
- Dynamic toll fare estimation
- Payment transaction logging to MongoDB

### Admin Experience

- Protected admin dashboard
- System summary metrics from live database aggregates
- Fleet-wide vehicle statistics
- Last 7 days transaction export to PDF

## API Highlights

- `GET /api/transactions`
- `GET /api/transactions/:vehicleNumber`
- `POST /api/transactions`
- `GET /api/admin/vehicle-stats`
- `GET /api/admin/system-summary`
- `GET /api/admin/recent-transactions`

## Notes

- The backend should be started from the `server/` directory so `.env` is loaded correctly.
- The frontend API client points to `http://localhost:5000/api`.
- Auth state is persisted in local storage, so refreshes keep the session active.

## License

No license has been specified for this project.
