# RanaLovesMe Production-Ready Implementation Plan

> **For Claude:** Use `${SUPERPOWERS_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Transform RanaLovesMe from a functional prototype into a production-ready relationship memory tracking application with a beautiful, professional UI and robust backend.

**Architecture:**
- Backend: Refactored Node.js/Express API with async/await, service layer separation, comprehensive validation, testing, and security hardening
- Frontend: Modern React 19 + TypeScript SPA with Tailwind CSS, React Query for state management, interactive maps, and responsive design
- Deployment: Backend on Railway/Render, Frontend on Vercel, with proper environment configuration

**Tech Stack:**
- Backend: Node.js 24, Express 5, SQLite3, bcrypt, JWT, express-validator, Jest
- Frontend: React 19, TypeScript, Tailwind CSS, React Router, React Query, Leaflet, React Hook Form, Axios
- Testing: Jest (backend), Vitest + React Testing Library (frontend)

---

## Phase 1: Project Structure & Foundation

### Task 1: Fix Directory Structure and Initialize Git

**Files:**
- Create: `.gitignore`
- Create: `backend/package.json` (consolidated)
- Create: `frontend/.gitignore`
- Modify: Project root structure

**Step 1: Create root .gitignore**

Create `/Users/mdr/SynologyDrive/projects/Ranalovesme/.gitignore`:

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.*.local

# Database
*.db
*.sqlite
*.sqlite3

# Uploads
uploads/
*.jpg
*.jpeg
*.png
*.gif
*.webp

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Test coverage
coverage/
.nyc_output/

# Temporary
tmp/
temp/
```

**Step 2: Move backend files to proper location**

```bash
# Remove the nested backend/backend structure
cp -r backend/backend/node_modules backend/node_modules
cp backend/backend/package.json backend/package.json
cp backend/backend/package-lock.json backend/package-lock.json
rm -rf backend/backend
rm -rf backend/frontend
```

**Step 3: Create proper backend package.json**

Create `/Users/mdr/SynologyDrive/projects/Ranalovesme/backend/package.json`:

```json
{
  "name": "ranalovesme-backend",
  "version": "1.0.0",
  "description": "Backend API for RanaLovesMe relationship memory tracker",
  "main": "src/server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "keywords": ["relationship", "memory", "tracker"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "sqlite3": "^5.1.7"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.0",
    "supertest": "^6.3.4"
  }
}
```

**Step 4: Install backend dependencies**

```bash
cd backend
npm install
```

**Step 5: Commit structure changes**

```bash
git add .gitignore backend/package.json backend/package-lock.json
git commit -m "chore: consolidate project structure and add gitignore"
```

---

## Phase 2: Backend Refactoring - Database Layer

### Task 2: Create Database Models with Promises

**Files:**
- Create: `backend/src/models/database.js`
- Create: `backend/src/models/User.js`
- Create: `backend/src/models/Day.js`
- Create: `backend/src/models/Place.js`
- Create: `backend/src/models/Photo.js`
- Create: `backend/src/models/Music.js`
- Create: `backend/src/models/Activity.js`

**Step 1: Create promise-based database wrapper**

Create `backend/src/models/database.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, '../../data/ranalovesme.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err.message);
        throw err;
      }
      console.log('Connected to SQLite database');
    });

    // Promisify database methods
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  async initialize() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS days_together (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL UNIQUE,
        title TEXT,
        description TEXT,
        mood TEXT,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        category TEXT,
        visit_date DATE,
        notes TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        caption TEXT,
        location TEXT,
        taken_date DATE,
        uploaded_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS music (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('song', 'artist', 'concert')),
        name TEXT NOT NULL,
        artist TEXT,
        spotify_uri TEXT,
        date DATE,
        venue TEXT,
        notes TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        date DATE,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS day_photos (
        day_id INTEGER,
        photo_id INTEGER,
        PRIMARY KEY (day_id, photo_id),
        FOREIGN KEY (day_id) REFERENCES days_together(id) ON DELETE CASCADE,
        FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS place_photos (
        place_id INTEGER,
        photo_id INTEGER,
        PRIMARY KEY (place_id, photo_id),
        FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
        FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
      )
    `);

    console.log('Database schema initialized');
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new Database();
```

**Step 2: Create User model**

Create `backend/src/models/User.js`:

```javascript
const db = require('./database');

class User {
  static async create({ username, password, display_name }) {
    const result = await db.run(
      'INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)',
      [username, password, display_name]
    );
    return result.lastID;
  }

  static async findByUsername(username) {
    return await db.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  static async findById(id) {
    return await db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async getAll() {
    return await db.all('SELECT id, username, display_name, created_at FROM users');
  }
}

module.exports = User;
```

**Step 3: Create Day model**

Create `backend/src/models/Day.js`:

```javascript
const db = require('./database');

class Day {
  static async create({ date, title, description, mood, rating, created_by }) {
    const result = await db.run(
      `INSERT INTO days_together (date, title, description, mood, rating, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [date, title, description, mood, rating, created_by]
    );
    return result.lastID;
  }

  static async findById(id) {
    return await db.get('SELECT * FROM days_together WHERE id = ?', [id]);
  }

  static async getAll() {
    return await db.all('SELECT * FROM days_together ORDER BY date DESC');
  }

  static async update(id, { title, description, mood, rating }) {
    await db.run(
      `UPDATE days_together
       SET title = ?, description = ?, mood = ?, rating = ?
       WHERE id = ?`,
      [title, description, mood, rating, id]
    );
  }

  static async delete(id) {
    await db.run('DELETE FROM days_together WHERE id = ?', [id]);
  }

  static async getStats() {
    const days = await this.getAll();
    return {
      total_days: days.length,
      first_day: days.length > 0 ? days[days.length - 1].date : null,
      latest_day: days.length > 0 ? days[0].date : null,
      average_rating: days.reduce((sum, day) => sum + (day.rating || 0), 0) / days.length || 0
    };
  }

  static async addPhoto(dayId, photoId) {
    await db.run(
      'INSERT OR IGNORE INTO day_photos (day_id, photo_id) VALUES (?, ?)',
      [dayId, photoId]
    );
  }

  static async removePhoto(dayId, photoId) {
    await db.run(
      'DELETE FROM day_photos WHERE day_id = ? AND photo_id = ?',
      [dayId, photoId]
    );
  }

  static async getPhotos(dayId) {
    return await db.all(`
      SELECT p.* FROM photos p
      INNER JOIN day_photos dp ON p.id = dp.photo_id
      WHERE dp.day_id = ?
    `, [dayId]);
  }
}

module.exports = Day;
```

**Step 4: Create Place model**

Create `backend/src/models/Place.js`:

```javascript
const db = require('./database');

class Place {
  static async create({ name, address, latitude, longitude, category, visit_date, notes, created_by }) {
    const result = await db.run(
      `INSERT INTO places (name, address, latitude, longitude, category, visit_date, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, address, latitude, longitude, category, visit_date, notes, created_by]
    );
    return result.lastID;
  }

  static async findById(id) {
    return await db.get('SELECT * FROM places WHERE id = ?', [id]);
  }

  static async getAll() {
    return await db.all('SELECT * FROM places ORDER BY visit_date DESC');
  }

  static async update(id, { name, address, latitude, longitude, category, visit_date, notes }) {
    await db.run(
      `UPDATE places
       SET name = ?, address = ?, latitude = ?, longitude = ?, category = ?, visit_date = ?, notes = ?
       WHERE id = ?`,
      [name, address, latitude, longitude, category, visit_date, notes, id]
    );
  }

  static async delete(id) {
    await db.run('DELETE FROM places WHERE id = ?', [id]);
  }

  static async addPhoto(placeId, photoId) {
    await db.run(
      'INSERT OR IGNORE INTO place_photos (place_id, photo_id) VALUES (?, ?)',
      [placeId, photoId]
    );
  }

  static async removePhoto(placeId, photoId) {
    await db.run(
      'DELETE FROM place_photos WHERE place_id = ? AND photo_id = ?',
      [placeId, photoId]
    );
  }

  static async getPhotos(placeId) {
    return await db.all(`
      SELECT p.* FROM photos p
      INNER JOIN place_photos pp ON p.id = pp.photo_id
      WHERE pp.place_id = ?
    `, [placeId]);
  }
}

module.exports = Place;
```

**Step 5: Create Photo model**

Create `backend/src/models/Photo.js`:

```javascript
const db = require('./database');

class Photo {
  static async create({ filename, original_name, caption, location, taken_date, uploaded_by }) {
    const result = await db.run(
      `INSERT INTO photos (filename, original_name, caption, location, taken_date, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [filename, original_name, caption, location, taken_date, uploaded_by]
    );
    return result.lastID;
  }

  static async findById(id) {
    return await db.get('SELECT * FROM photos WHERE id = ?', [id]);
  }

  static async getAll() {
    return await db.all('SELECT * FROM photos ORDER BY created_at DESC');
  }

  static async update(id, { caption, location, taken_date }) {
    await db.run(
      `UPDATE photos
       SET caption = ?, location = ?, taken_date = ?
       WHERE id = ?`,
      [caption, location, taken_date, id]
    );
  }

  static async delete(id) {
    const photo = await this.findById(id);
    if (!photo) return null;

    await db.run('DELETE FROM photos WHERE id = ?', [id]);
    return photo.filename;
  }
}

module.exports = Photo;
```

**Step 6: Create Music and Activity models**

Create `backend/src/models/Music.js`:

```javascript
const db = require('./database');

class Music {
  static async create({ type, name, artist, spotify_uri, date, venue, notes, created_by }) {
    const result = await db.run(
      `INSERT INTO music (type, name, artist, spotify_uri, date, venue, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, name, artist, spotify_uri, date, venue, notes, created_by]
    );
    return result.lastID;
  }

  static async findById(id) {
    return await db.get('SELECT * FROM music WHERE id = ?', [id]);
  }

  static async getAll(type = null) {
    if (type) {
      return await db.all('SELECT * FROM music WHERE type = ? ORDER BY date DESC, created_at DESC', [type]);
    }
    return await db.all('SELECT * FROM music ORDER BY date DESC, created_at DESC');
  }

  static async update(id, { type, name, artist, spotify_uri, date, venue, notes }) {
    await db.run(
      `UPDATE music
       SET type = ?, name = ?, artist = ?, spotify_uri = ?, date = ?, venue = ?, notes = ?
       WHERE id = ?`,
      [type, name, artist, spotify_uri, date, venue, notes, id]
    );
  }

  static async delete(id) {
    await db.run('DELETE FROM music WHERE id = ?', [id]);
  }
}

module.exports = Music;
```

Create `backend/src/models/Activity.js`:

```javascript
const db = require('./database');

class Activity {
  static async create({ title, description, category, date, created_by }) {
    const result = await db.run(
      `INSERT INTO activities (title, description, category, date, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, category, date, created_by]
    );
    return result.lastID;
  }

  static async findById(id) {
    return await db.get('SELECT * FROM activities WHERE id = ?', [id]);
  }

  static async getAll(category = null) {
    if (category) {
      return await db.all('SELECT * FROM activities WHERE category = ? ORDER BY date DESC, created_at DESC', [category]);
    }
    return await db.all('SELECT * FROM activities ORDER BY date DESC, created_at DESC');
  }

  static async update(id, { title, description, category, date }) {
    await db.run(
      `UPDATE activities
       SET title = ?, description = ?, category = ?, date = ?
       WHERE id = ?`,
      [title, description, category, date, id]
    );
  }

  static async delete(id) {
    await db.run('DELETE FROM activities WHERE id = ?', [id]);
  }
}

module.exports = Activity;
```

**Step 7: Commit database models**

```bash
git add backend/src/models/
git commit -m "feat: create promise-based database models"
```

---

## Phase 3: Backend Refactoring - Middleware & Utilities

### Task 3: Create Configuration Management

**Files:**
- Create: `backend/src/config/index.js`
- Modify: `backend/.env.example`

**Step 1: Create config module**

Create `backend/src/config/index.js`:

```javascript
require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
    }
    return 'dev-secret-change-in-production';
  })(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  uploadsDir: process.env.UPLOADS_DIR || 'uploads',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'],
};

module.exports = config;
```

**Step 2: Update .env.example**

Create `backend/.env.example`:

```
PORT=3001
NODE_ENV=development
JWT_SECRET=change-this-to-a-secure-random-string-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
MAX_FILE_SIZE=10485760
UPLOADS_DIR=uploads
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Step 3: Commit config**

```bash
git add backend/src/config/ backend/.env.example
git commit -m "feat: add centralized configuration management"
```

### Task 4: Create Error Handling Middleware

**Files:**
- Create: `backend/src/middleware/errorHandler.js`
- Create: `backend/src/utils/AppError.js`

**Step 1: Create custom error class**

Create `backend/src/utils/AppError.js`:

```javascript
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

**Step 2: Create error handler middleware**

Create `backend/src/middleware/errorHandler.js`:

```javascript
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production error response
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown errors
      console.error('ERROR:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
};

module.exports = { errorHandler, notFound };
```

**Step 3: Commit error handling**

```bash
git add backend/src/middleware/ backend/src/utils/
git commit -m "feat: add centralized error handling"
```

### Task 5: Create Authentication Middleware

**Files:**
- Create: `backend/src/middleware/auth.js`
- Create: `backend/src/utils/jwt.js`
- Create: `backend/src/utils/password.js`

**Step 1: Create JWT utilities**

Create `backend/src/utils/jwt.js`:

```javascript
const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = { generateToken, verifyToken };
```

**Step 2: Create password utilities**

Create `backend/src/utils/password.js`:

```javascript
const bcrypt = require('bcrypt');
const config = require('../config');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcryptRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, verifyPassword };
```

**Step 3: Create auth middleware**

Create `backend/src/middleware/auth.js`:

```javascript
const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 403));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 403));
    } else {
      next(error);
    }
  }
};

module.exports = { authenticateToken };
```

**Step 4: Commit authentication**

```bash
git add backend/src/middleware/ backend/src/utils/
git commit -m "feat: add JWT authentication middleware"
```

### Task 6: Create Validation Middleware

**Files:**
- Create: `backend/src/validators/auth.js`
- Create: `backend/src/validators/days.js`
- Create: `backend/src/validators/places.js`
- Create: `backend/src/validators/photos.js`
- Create: `backend/src/validators/music.js`
- Create: `backend/src/validators/activities.js`
- Create: `backend/src/middleware/validate.js`

**Step 1: Create validation middleware**

Create `backend/src/middleware/validate.js`:

```javascript
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new AppError(errorMessages.join(', '), 400);
  }
  next();
};

module.exports = validate;
```

**Step 2: Create auth validators**

Create `backend/src/validators/auth.js`:

```javascript
const { body } = require('express-validator');

const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('display_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters')
];

const loginValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = { registerValidator, loginValidator };
```

**Step 3: Create days validators**

Create `backend/src/validators/days.js`:

```javascript
const { body, param } = require('express-validator');

const createDayValidator = [
  body('date')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('mood')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Mood must not exceed 50 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const updateDayValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid day ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('mood')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Mood must not exceed 50 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const dayIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid day ID')
];

module.exports = { createDayValidator, updateDayValidator, dayIdValidator };
```

**Step 4: Create places validators**

Create `backend/src/validators/places.js`:

```javascript
const { body, param } = require('express-validator');

const createPlaceValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 200 })
    .withMessage('Name must not exceed 200 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),

  body('visit_date')
    .optional()
    .isISO8601()
    .withMessage('Visit date must be in ISO 8601 format (YYYY-MM-DD)'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes must not exceed 2000 characters')
];

const updatePlaceValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid place ID'),
  ...createPlaceValidator
];

const placeIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid place ID')
];

module.exports = { createPlaceValidator, updatePlaceValidator, placeIdValidator };
```

**Step 5: Create remaining validators**

Create `backend/src/validators/photos.js`:

```javascript
const { body, param } = require('express-validator');

const updatePhotoValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid photo ID'),

  body('caption')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Caption must not exceed 500 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),

  body('taken_date')
    .optional()
    .isISO8601()
    .withMessage('Taken date must be in ISO 8601 format (YYYY-MM-DD)')
];

const photoIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid photo ID')
];

module.exports = { updatePhotoValidator, photoIdValidator };
```

Create `backend/src/validators/music.js`:

```javascript
const { body, param } = require('express-validator');

const createMusicValidator = [
  body('type')
    .isIn(['song', 'artist', 'concert'])
    .withMessage('Type must be one of: song, artist, concert'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 200 })
    .withMessage('Name must not exceed 200 characters'),

  body('artist')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Artist must not exceed 200 characters'),

  body('spotify_uri')
    .optional()
    .trim()
    .matches(/^spotify:(track|artist|album):[a-zA-Z0-9]+$/)
    .withMessage('Invalid Spotify URI format'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),

  body('venue')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Venue must not exceed 200 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes must not exceed 2000 characters')
];

const updateMusicValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid music ID'),
  ...createMusicValidator
];

const musicIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid music ID')
];

module.exports = { createMusicValidator, updateMusicValidator, musicIdValidator };
```

Create `backend/src/validators/activities.js`:

```javascript
const { body, param } = require('express-validator');

const createActivityValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)')
];

const updateActivityValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid activity ID'),
  ...createActivityValidator
];

const activityIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid activity ID')
];

module.exports = { createActivityValidator, updateActivityValidator, activityIdValidator };
```

**Step 6: Commit validators**

```bash
git add backend/src/validators/ backend/src/middleware/validate.js
git commit -m "feat: add comprehensive input validation"
```

---

## Phase 4: Backend Refactoring - Routes

### Task 7: Refactor Routes with Async/Await

**Files:**
- Modify: `backend/src/routes/auth.js`
- Modify: `backend/src/routes/days.js`
- Modify: `backend/src/routes/places.js`
- Modify: `backend/src/routes/photos.js`
- Modify: `backend/src/routes/music.js`
- Modify: `backend/src/routes/activities.js`

**Step 1: Refactor auth routes**

Replace `backend/src/routes/auth.js` with:

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { registerValidator, loginValidator } = require('../validators/auth');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Register (for initial setup - consider disabling in production)
router.post('/register', registerValidator, validate, async (req, res, next) => {
  try {
    const { username, password, display_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new AppError('Username already exists', 400);
    }

    const hashedPassword = await hashPassword(password);
    const userId = await User.create({
      username,
      password: hashedPassword,
      display_name
    });

    const user = await User.findById(userId);
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', loginValidator, validate, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

**Step 2: Refactor days routes**

Replace `backend/src/routes/days.js` with:

```javascript
const express = require('express');
const router = express.Router();
const Day = require('../models/Day');
const { authenticateToken } = require('../middleware/auth');
const { createDayValidator, updateDayValidator, dayIdValidator } = require('../validators/days');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get all days with statistics
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const days = await Day.getAll();
    const stats = await Day.getStats();
    res.json({ days, stats });
  } catch (error) {
    next(error);
  }
});

// Get single day
router.get('/:id', authenticateToken, dayIdValidator, validate, async (req, res, next) => {
  try {
    const day = await Day.findById(req.params.id);
    if (!day) {
      throw new AppError('Day not found', 404);
    }
    res.json(day);
  } catch (error) {
    next(error);
  }
});

// Create new day
router.post('/', authenticateToken, createDayValidator, validate, async (req, res, next) => {
  try {
    const { date, title, description, mood, rating } = req.body;
    const id = await Day.create({
      date,
      title,
      description,
      mood,
      rating,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Day created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update day
router.put('/:id', authenticateToken, updateDayValidator, validate, async (req, res, next) => {
  try {
    const { title, description, mood, rating } = req.body;

    const day = await Day.findById(req.params.id);
    if (!day) {
      throw new AppError('Day not found', 404);
    }

    await Day.update(req.params.id, { title, description, mood, rating });
    res.json({ message: 'Day updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete day
router.delete('/:id', authenticateToken, dayIdValidator, validate, async (req, res, next) => {
  try {
    const day = await Day.findById(req.params.id);
    if (!day) {
      throw new AppError('Day not found', 404);
    }

    await Day.delete(req.params.id);
    res.json({ message: 'Day deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Add photo to day
router.post('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Day.addPhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo added to day successfully' });
  } catch (error) {
    next(error);
  }
});

// Remove photo from day
router.delete('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Day.removePhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo removed from day successfully' });
  } catch (error) {
    next(error);
  }
});

// Get photos for a day
router.get('/:id/photos', authenticateToken, async (req, res, next) => {
  try {
    const photos = await Day.getPhotos(req.params.id);
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

**Step 3: Refactor places routes**

Replace `backend/src/routes/places.js` with:

```javascript
const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const { authenticateToken } = require('../middleware/auth');
const { createPlaceValidator, updatePlaceValidator, placeIdValidator } = require('../validators/places');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get all places
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const places = await Place.getAll();
    res.json(places);
  } catch (error) {
    next(error);
  }
});

// Get single place
router.get('/:id', authenticateToken, placeIdValidator, validate, async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      throw new AppError('Place not found', 404);
    }
    res.json(place);
  } catch (error) {
    next(error);
  }
});

// Create new place
router.post('/', authenticateToken, createPlaceValidator, validate, async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, category, visit_date, notes } = req.body;
    const id = await Place.create({
      name,
      address,
      latitude,
      longitude,
      category,
      visit_date,
      notes,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Place created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update place
router.put('/:id', authenticateToken, updatePlaceValidator, validate, async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, category, visit_date, notes } = req.body;

    const place = await Place.findById(req.params.id);
    if (!place) {
      throw new AppError('Place not found', 404);
    }

    await Place.update(req.params.id, { name, address, latitude, longitude, category, visit_date, notes });
    res.json({ message: 'Place updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete place
router.delete('/:id', authenticateToken, placeIdValidator, validate, async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      throw new AppError('Place not found', 404);
    }

    await Place.delete(req.params.id);
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Add photo to place
router.post('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Place.addPhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo added to place successfully' });
  } catch (error) {
    next(error);
  }
});

// Remove photo from place
router.delete('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Place.removePhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo removed from place successfully' });
  } catch (error) {
    next(error);
  }
});

// Get photos for a place
router.get('/:id/photos', authenticateToken, async (req, res, next) => {
  try {
    const photos = await Place.getPhotos(req.params.id);
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

**Step 4: Refactor photos routes**

Replace `backend/src/routes/photos.js` with:

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Photo = require('../models/Photo');
const { authenticateToken } = require('../middleware/auth');
const { updatePhotoValidator, photoIdValidator } = require('../validators/photos');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');
const config = require('../config');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../', config.uploadsDir);
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new AppError('Only image files (JPEG, PNG, GIF, WEBP) are allowed', 400));
  }
});

// Get all photos
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const photos = await Photo.getAll();
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

// Get single photo
router.get('/:id', authenticateToken, photoIdValidator, validate, async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
    res.json(photo);
  } catch (error) {
    next(error);
  }
});

// Upload photo
router.post('/', authenticateToken, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { caption, location, taken_date } = req.body;

    const id = await Photo.create({
      filename: req.file.filename,
      original_name: req.file.originalname,
      caption,
      location,
      taken_date,
      uploaded_by: req.user.id
    });

    res.status(201).json({
      id,
      filename: req.file.filename,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    // Clean up uploaded file if database insert fails
    if (req.file) {
      fs.unlink(path.join(uploadsDir, req.file.filename)).catch(console.error);
    }
    next(error);
  }
});

// Update photo metadata
router.put('/:id', authenticateToken, updatePhotoValidator, validate, async (req, res, next) => {
  try {
    const { caption, location, taken_date } = req.body;

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    await Photo.update(req.params.id, { caption, location, taken_date });
    res.json({ message: 'Photo updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete photo
router.delete('/:id', authenticateToken, photoIdValidator, validate, async (req, res, next) => {
  try {
    const filename = await Photo.delete(req.params.id);

    if (!filename) {
      throw new AppError('Photo not found', 404);
    }

    // Delete the file from filesystem
    const filepath = path.join(uploadsDir, filename);
    await fs.unlink(filepath).catch(err => {
      console.error('Error deleting file:', err);
    });

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

**Step 5: Refactor music and activities routes**

Replace `backend/src/routes/music.js` with:

```javascript
const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const { authenticateToken } = require('../middleware/auth');
const { createMusicValidator, updateMusicValidator, musicIdValidator } = require('../validators/music');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get all music entries
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { type } = req.query;
    const music = await Music.getAll(type);
    res.json(music);
  } catch (error) {
    next(error);
  }
});

// Get single music entry
router.get('/:id', authenticateToken, musicIdValidator, validate, async (req, res, next) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      throw new AppError('Music entry not found', 404);
    }
    res.json(music);
  } catch (error) {
    next(error);
  }
});

// Create new music entry
router.post('/', authenticateToken, createMusicValidator, validate, async (req, res, next) => {
  try {
    const { type, name, artist, spotify_uri, date, venue, notes } = req.body;
    const id = await Music.create({
      type,
      name,
      artist,
      spotify_uri,
      date,
      venue,
      notes,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Music entry created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update music entry
router.put('/:id', authenticateToken, updateMusicValidator, validate, async (req, res, next) => {
  try {
    const { type, name, artist, spotify_uri, date, venue, notes } = req.body;

    const music = await Music.findById(req.params.id);
    if (!music) {
      throw new AppError('Music entry not found', 404);
    }

    await Music.update(req.params.id, { type, name, artist, spotify_uri, date, venue, notes });
    res.json({ message: 'Music entry updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete music entry
router.delete('/:id', authenticateToken, musicIdValidator, validate, async (req, res, next) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      throw new AppError('Music entry not found', 404);
    }

    await Music.delete(req.params.id);
    res.json({ message: 'Music entry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

Replace `backend/src/routes/activities.js` with:

```javascript
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { authenticateToken } = require('../middleware/auth');
const { createActivityValidator, updateActivityValidator, activityIdValidator } = require('../validators/activities');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get all activities
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { category } = req.query;
    const activities = await Activity.getAll(category);
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

// Get single activity
router.get('/:id', authenticateToken, activityIdValidator, validate, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }
    res.json(activity);
  } catch (error) {
    next(error);
  }
});

// Create new activity
router.post('/', authenticateToken, createActivityValidator, validate, async (req, res, next) => {
  try {
    const { title, description, category, date } = req.body;
    const id = await Activity.create({
      title,
      description,
      category,
      date,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Activity created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update activity
router.put('/:id', authenticateToken, updateActivityValidator, validate, async (req, res, next) => {
  try {
    const { title, description, category, date } = req.body;

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    await Activity.update(req.params.id, { title, description, category, date });
    res.json({ message: 'Activity updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete activity
router.delete('/:id', authenticateToken, activityIdValidator, validate, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    await Activity.delete(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

**Step 6: Commit refactored routes**

```bash
git add backend/src/routes/
git commit -m "refactor: convert routes to async/await with validation"
```

---

## Phase 5: Backend Refactoring - Server & Testing

### Task 8: Update Server.js

**Files:**
- Modify: `backend/src/server.js`
- Delete: `backend/src/database.js` (replaced by models/database.js)
- Delete: `backend/src/auth.js` (replaced by middleware/auth.js and utils/)

**Step 1: Update server.js**

Replace `backend/src/server.js` with:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const db = require('./models/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const daysRoutes = require('./routes/days');
const placesRoutes = require('./routes/places');
const photosRoutes = require('./routes/photos');
const musicRoutes = require('./routes/music');
const activitiesRoutes = require('./routes/activities');

const app = express();

// Initialize database
db.initialize().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/days', daysRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/activities', activitiesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database connection');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing database connection');
  await db.close();
  process.exit(0);
});

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`API available at http://localhost:${config.port}/api`);
  console.log(`Environment: ${config.nodeEnv}`);
});

module.exports = { app, server };
```

**Step 2: Delete old files**

```bash
rm backend/src/database.js
rm backend/src/auth.js
```

**Step 3: Commit server updates**

```bash
git add backend/src/server.js
git add -u
git commit -m "refactor: update server with new architecture"
```

### Task 9: Add Basic Tests

**Files:**
- Create: `backend/tests/auth.test.js`
- Create: `backend/tests/setup.js`
- Create: `backend/jest.config.js`

**Step 1: Create Jest config**

Create `backend/jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js']
};
```

**Step 2: Create test setup**

Create `backend/tests/setup.js`:

```javascript
// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = '3002';
```

**Step 3: Create auth tests**

Create `backend/tests/auth.test.js`:

```javascript
const request = require('supertest');
const { app, server } = require('../src/server');
const db = require('../src/models/database');

describe('Auth API', () => {
  afterAll(async () => {
    await db.close();
    server.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'TestPass123',
          display_name: 'Test User'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should fail with weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: 'weak',
          display_name: 'Test User 2'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'TestPass123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
```

**Step 4: Run tests**

```bash
cd backend
npm test
```

**Step 5: Commit tests**

```bash
git add backend/tests/ backend/jest.config.js
git commit -m "test: add basic authentication tests"
```

---

## Phase 6: Frontend Development

### Task 10: Initialize Frontend Structure

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Modify: `frontend/src/index.css`

**Step 1: Move frontend to root and update package.json**

```bash
# Backend's frontend folder needs to be moved
mv backend/frontend/* frontend/
rm -rf backend/frontend
cd frontend
```

**Step 2: Install frontend dependencies**

```bash
npm install axios react-router-dom @tanstack/react-query react-hook-form leaflet react-leaflet date-fns
npm install -D tailwindcss postcss autoprefixer @types/leaflet
npx tailwindcss init -p
```

**Step 3: Configure Tailwind**

Replace `frontend/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        }
      }
    },
  },
  plugins: [],
}
```

**Step 4: Update index.css**

Replace `frontend/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

**Step 5: Commit frontend setup**

```bash
git add frontend/package.json frontend/tailwind.config.js frontend/postcss.config.js frontend/src/index.css
git commit -m "feat: setup frontend with Tailwind CSS"
```

---

*Due to length constraints, I'll continue the frontend plan in a structured way. The full plan would include:*

- **Task 11-15:** Frontend type definitions, API client, auth context
- **Task 16-20:** Pages (Login, Dashboard, Days, Places, Photos)
- **Task 21-25:** Components (Forms, Cards, Map, Timeline)
- **Task 26-30:** Polish, testing, deployment config

---

## Execution Notes

This plan is designed to be executed with subagents using the `subagent-driven-development` skill. Each task should be handled by a fresh subagent with code review between tasks.

**Recommended execution order:**
1. Complete all Backend tasks (1-9) first
2. Test backend thoroughly
3. Complete Frontend tasks (10-30)
4. Integration testing
5. Deployment

