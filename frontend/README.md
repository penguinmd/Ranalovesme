# RanaLovesMe Frontend

A beautiful, professional React + TypeScript frontend for tracking relationship memories.

## Features

- **Authentication**: Secure login/registration with JWT tokens
- **Dashboard**: Overview with statistics and recent activity
- **Days Tracker**: Record and browse memorable days together with ratings and moods
- **Places Map**: Interactive map showing places you've visited together
- **Photo Gallery**: Upload and view your special moments
- **Music Tracker**: Keep track of songs, concerts, and artists that are meaningful
- **Activities Log**: Document activities and experiences by category

## Tech Stack

- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Leaflet** - Interactive maps
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on http://localhost:3001

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (runs on http://localhost:3000)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── Layout.tsx   # Main layout with navigation
│   └── ProtectedRoute.tsx
├── contexts/        # React contexts
│   └── AuthContext.tsx
├── lib/            # Utilities and API client
│   └── api.ts      # Axios API client
├── pages/          # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Days.tsx
│   ├── DayDetail.tsx
│   ├── Places.tsx
│   ├── Photos.tsx
│   ├── Music.tsx
│   └── Activities.tsx
├── types/          # TypeScript types
│   └── index.ts
├── App.tsx         # Main app component with routing
└── main.tsx        # Entry point
```

## API Integration

The frontend communicates with the backend API at `http://localhost:3001/api`. The Vite dev server is configured to proxy API requests.

## Environment Configuration

The frontend is configured to work with:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

To change these, update `vite.config.ts` and `src/lib/api.ts`.
