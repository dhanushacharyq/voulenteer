# VolunteerHub — React App

## Project Structure
```
volunteerhub/
├── public/
│   └── index.html
├── src/
│   ├── index.js          ← Entry point
│   └── VolunteerHub.jsx  ← Full app (all pages + components)
└── package.json
```

## Setup & Run

1. Place `VolunteerHub.jsx` inside your `src/` folder
2. Install dependencies:
```bash
npm install
```
3. Start the dev server:
```bash
npm start
```
4. Open [http://localhost:3000](http://localhost:3000)

## Build for Production
```bash
npm run build
```

## Login Credentials (Demo)
- **Admin:** admin@hub.com / admin123
- **Volunteer:** vol@hub.com / vol123
- **Admin Access Code (registration):** ADMHUB2025

## Features Converted
- ✅ Custom gold cursor animation (dot + ring + trail)
- ✅ Home page with hero, features, events grid
- ✅ Login page with role toggle & forgot password flow
- ✅ Volunteer & Admin multi-step registration
- ✅ Admin panel with sidebar navigation
- ✅ Manage Events (add events, they appear live on homepage)
- ✅ Assign volunteers to events
- ✅ Mark attendance
- ✅ Send notifications (appear in bell panel)
- ✅ Smart Scheduling, Attendance Records, Performance Reviews pages
- ✅ Feedback modal (admin only)
- ✅ Toast notifications
- ✅ All events & Event detail pages
- ✅ Notification bell panel (real-time, no demo data)

## Backend Integration
Replace the in-memory state in `App()` with API calls to your backend.
Key state variables to wire up:
- `volunteers` — GET/POST /api/volunteers
- `events` — GET/POST /api/events
- `assignments` — GET/POST /api/assignments
- `attendanceRecords` — GET/POST /api/attendance
- `notifications` — GET/POST /api/notifications
