# WayNote - Intelligent Mobility Insights Platform

WayNote is a full-stack mobility intelligence app that records trips, detects transport mode from motion, maps travel density on a zoomable India heatmap, and surfaces insights for both citizens and government planners.

It is designed as a portfolio-grade system that demonstrates product thinking, data modeling, geospatial analytics, and real-world full-stack execution.

## Why This Project Stands Out

- Solves a real public-impact problem: transportation planning with user-contributed mobility data.
- Moves beyond CRUD by combining geolocation, reverse geocoding, mode inference, and geospatial density mapping.
- Implements role-based analytics:
  - User Dashboard for personal mobility behavior.
  - Government Dashboard for aggregated city-level planning insights.
- Uses coordinate-based heatmap analytics instead of static place-name tags.
- Includes backend persistence, API design, data normalization, and live refresh behavior.

## Core Capabilities

### 1. Smart Trip Tracking
- GPS-based auto-tracking with live duration and point recording.
- Transport mode inference from speed patterns:
  - walking
  - cycling
  - bus
  - car
  - train
- Reverse geocoding from coordinates to readable source/destination labels.

### 2. Manual + Automatic Data Capture
- Manual trip creation with mode selection and metadata.
- Automatic capture includes coordinate payloads for high-quality mapping.

### 3. Geospatial Heatmap Intelligence
- Zoomable India map with density heat overlay (Leaflet + heat layer).
- Coordinate-first aggregation for accurate mapping.
- Finer spatial binning plus centroid-based aggregation for better point fidelity.
- Mode metadata retained in heatmap clusters:
  - dominant mode
  - mode breakdown per hotspot

### 4. Role-Based Dashboards
- User Dashboard:
  - total trips
  - most common mode
  - personal travel density heatmap
- Government Dashboard:
  - registered users overview
  - all-user aggregated heatmap
  - periodic auto-refresh controls

### 5. Reliable Data Sync
- Backend persistence in JSON datastore for rapid prototyping.
- Anti-cache API headers and no-store fetch usage for fresh state reflection.
- End-to-end trip deletion: UI action removes persisted backend record.

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- Sonner (toast notifications)
- Leaflet + react-leaflet + leaflet.heat

### Backend
- Node.js (ESM)
- Express
- CORS
- File-based persistence (JSON)

### Geospatial / Data Intelligence
- Browser Geolocation API
- Nominatim for forward and reverse geocoding
- Coordinate clustering and centroid math for heatmap accuracy

## Architecture Overview

- frontend: UI, route guards, tracking UX, dashboard visualization
- backend: auth, user trip APIs, heatmap aggregation APIs
- database/users.json: lightweight persistence layer for users and trips

Flow:
1. Client records trip data (manual or GPS).
2. Trip is normalized and saved through backend APIs.
3. APIs return user trips and aggregated heat points.
4. Dashboards visualize mode analytics and geospatial density.

## API Surface

### Auth
- GET /api/health
- POST /api/auth/signup
- POST /api/auth/login

### User Trips
- GET /api/user/trips?email=<user-email>
- POST /api/user/trips
- DELETE /api/user/trips/:tripId?email=<user-email>

### Government Analytics
- GET /api/admin/users
- GET /api/admin/heatmap

## Data Model Snapshot

Trip object fields used across UI and APIs:
- id
- title
- route
- time
- mode
- icon
- dateLabel
- startCoord: { latitude, longitude }
- endCoord: { latitude, longitude }
- optional notes and numberOfPeople

Heatmap point payload:
- latitude
- longitude
- visits
- dominantMode
- modeBreakdown

## Local Setup

## Prerequisites
- Node.js 18+
- npm 9+

### 1. Install dependencies

From project root:

- cd backend && npm install
- cd ../frontend && npm install

### 2. Start backend

- cd backend
- npm run dev

Backend runs at:
- http://localhost:4000

### 3. Start frontend

Open a second terminal:

- cd frontend
- npm run dev -- --host

Frontend runs at:
- http://localhost:8080

## Suggested Next Upgrades

- Move storage to PostgreSQL and PostGIS for production geospatial querying.
- Add secure auth (JWT + refresh tokens + password hashing).
- Add test suite (unit + API + component + E2E).
- Introduce background jobs for geocoding and analytics precomputation.
- Add CI/CD pipeline and deployment targets with environment-based configs.

## Project Structure

- backend
  - server.js
  - database/users-db.js
  - database/users.json
- frontend
  - src/pages
  - src/components
  - src/lib

## License

This project is currently for educational and portfolio demonstration purposes.
