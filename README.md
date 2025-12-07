# Booking Management System

A full-stack SaaS simulation for managing meeting room reservations with real-time updates and conflict detection.

## How to Run

### Backend
1. `cd backend`
2. `npm install`
3. `npm start` (Runs on http://localhost:3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on http://localhost:5173)

## Logic Explained

### Conflict Detection
We prevent double bookings by ensuring no new booking overlaps with an existing active booking.
Formula: `(StartA < EndB) && (EndA > StartB)`

### Optimistic UI
The frontend uses React Query to immediately reflect a booking on the screen before the server confirms it. If the server returns a conflict error, the UI automatically rolls back.

### Authentication
Simple JWT-based auth without refresh tokens (as per test requirements).
