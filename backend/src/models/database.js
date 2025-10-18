const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

class Database {
  constructor() {
    // Use /tmp for Railway or local data directory
    const dataDir = process.env.DATABASE_DIR || path.join(__dirname, '../../data');

    // Ensure directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'ranalovesme.db');
    console.log('Database path:', dbPath);

    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err.message);
        throw err;
      }
      console.log('Connected to SQLite database at:', dbPath);
    });

    // Promisify database methods with custom wrapper for run to preserve lastID
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
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

    // Create default users (Rana and Mark) if they don't exist
    await this.setupDefaultUsers();
  }

  async setupDefaultUsers() {
    try {
      const { hashPassword } = require('../utils/password');
      const password = 'Gentoo12mdr!';
      const hashedPassword = await hashPassword(password);

      // Check and create Rana's account
      const ranaExists = await this.get('SELECT id FROM users WHERE username = ?', ['rana']);
      if (!ranaExists) {
        await this.run(
          'INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)',
          ['rana', hashedPassword, 'Rana']
        );
        console.log('✅ Created Rana\'s account');
      }

      // Check and create Mark's account
      const markExists = await this.get('SELECT id FROM users WHERE username = ?', ['mark']);
      if (!markExists) {
        await this.run(
          'INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)',
          ['mark', hashedPassword, 'Mark']
        );
        console.log('✅ Created Mark\'s account');
      }
    } catch (error) {
      console.error('Error setting up default users:', error);
      // Don't throw - let the app continue even if user setup fails
    }
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
