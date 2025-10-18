# RanaLovesMe - Quick Start Guide

This guide will help you get the RanaLovesMe relationship memory tracking app up and running.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server (runs on http://localhost:3001)
npm start
```

The backend should now be running and you should see:
```
Server is running on port 3001
API available at http://localhost:3001/api
```

### 2. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm run dev
```

The frontend should now be running and you should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

## Using the Application

1. **Open your browser** and navigate to http://localhost:3000

2. **Register a new account**:
   - Click "Register here" on the login page
   - Enter a username, display name, and password
   - Click "Register"

3. **Start tracking your memories**:
   - **Dashboard**: View your statistics and recent activity
   - **Days**: Add memorable days with dates, moods, ratings, and descriptions
   - **Places**: Track places you've visited with map integration
   - **Photos**: Upload and organize your photos
   - **Music**: Keep track of meaningful songs, concerts, and artists
   - **Activities**: Log activities by category

## Project Structure

```
Ranalovesme/
├── backend/               # Node.js + Express + SQLite backend
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & validation
│   │   └── server.js     # Main server file
│   └── database.sqlite   # SQLite database (created on first run)
│
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── lib/         # API client
│   │   ├── pages/       # Page components
│   │   └── types/       # TypeScript types
│   └── package.json
│
└── QUICK_START.md       # This file
```

## Tech Stack

### Backend
- Node.js + Express
- SQLite database
- JWT authentication
- Multer for file uploads
- Joi for validation

### Frontend
- React 19 + TypeScript
- Vite build tool
- Tailwind CSS
- React Router
- Axios for API calls
- React Leaflet for maps
- date-fns for date formatting

## API Endpoints

The backend provides the following API endpoints:

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Days**: `/api/days` (CRUD operations)
- **Places**: `/api/places` (CRUD operations)
- **Photos**: `/api/photos` (upload, view, delete)
- **Music**: `/api/music` (CRUD operations)
- **Activities**: `/api/activities` (CRUD operations)

## Development Tips

### Backend Development
- Backend uses nodemon for auto-restart on file changes
- Database is SQLite stored in `backend/database.sqlite`
- Uploaded photos stored in `backend/uploads/`

### Frontend Development
- Frontend uses Vite for fast HMR (Hot Module Replacement)
- API calls are proxied through Vite dev server
- Tailwind CSS for responsive styling

## Building for Production

### Backend
```bash
cd backend
npm start  # Uses Node.js directly in production
```

### Frontend
```bash
cd frontend
npm run build      # Creates production build in dist/
npm run preview    # Preview production build locally
```

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Ensure all dependencies are installed: `npm install`
- Check for error messages in the console

### Frontend won't start
- Check if port 3000 is already in use
- Ensure backend is running first
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Can't login/register
- Ensure backend is running on http://localhost:3001
- Check browser console for error messages
- Verify API endpoint in `frontend/src/lib/api.ts`

### Photos won't upload
- Ensure `backend/uploads` directory exists
- Check file size (default limit is 10MB)
- Check file type (images only)

## Features Highlights

1. **Secure Authentication** - JWT-based auth with protected routes
2. **Rich Content** - Track days with moods, ratings, and descriptions
3. **Interactive Maps** - Visualize places you've visited
4. **Photo Management** - Upload and organize memories
5. **Responsive Design** - Works on desktop, tablet, and mobile
6. **Real-time Updates** - Changes reflected immediately

## Next Steps

- Customize the color scheme in `frontend/tailwind.config.js`
- Add more photo categories or tags
- Implement photo galleries for specific days/places
- Add data export functionality
- Deploy to a hosting service

Enjoy tracking your memories! 💕
