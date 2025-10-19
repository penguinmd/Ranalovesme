import { sql } from '@vercel/postgres';

export { sql };

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create days_together table
    await sql`
      CREATE TABLE IF NOT EXISTS days_together (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        title TEXT,
        description TEXT,
        mood TEXT,
        rating INTEGER CHECK(rating >= 1 AND rating <= 10),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create places table
    await sql`
      CREATE TABLE IF NOT EXISTS places (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        category TEXT,
        visit_date DATE,
        notes TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create photos table
    await sql`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        caption TEXT,
        location TEXT,
        taken_date DATE,
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create music table
    await sql`
      CREATE TABLE IF NOT EXISTS music (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL CHECK(type IN ('song', 'artist', 'concert')),
        name TEXT NOT NULL,
        artist TEXT,
        spotify_uri TEXT,
        date DATE,
        venue TEXT,
        notes TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create activities table
    await sql`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        date DATE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create day_photos junction table
    await sql`
      CREATE TABLE IF NOT EXISTS day_photos (
        day_id INTEGER REFERENCES days_together(id) ON DELETE CASCADE,
        photo_id INTEGER REFERENCES photos(id) ON DELETE CASCADE,
        PRIMARY KEY (day_id, photo_id)
      )
    `;

    // Create place_photos junction table
    await sql`
      CREATE TABLE IF NOT EXISTS place_photos (
        place_id INTEGER REFERENCES places(id) ON DELETE CASCADE,
        photo_id INTEGER REFERENCES photos(id) ON DELETE CASCADE,
        PRIMARY KEY (place_id, photo_id)
      )
    `;

    console.log('✅ Database schema initialized');
    return { success: true };
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Setup default users (Rana and Mark)
export async function setupDefaultUsers() {
  try {
    const bcrypt = require('bcrypt');
    const password = 'Gentoo12mdr!';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check and create Rana's account
    const ranaExists = await sql`SELECT id FROM users WHERE username = 'rana'`;
    if (ranaExists.rows.length === 0) {
      await sql`
        INSERT INTO users (username, password, display_name)
        VALUES ('rana', ${hashedPassword}, 'Rana')
      `;
      console.log('✅ Created Rana\'s account');
    } else {
      console.log('ℹ️  Rana\'s account already exists');
    }

    // Check and create Mark's account
    const markExists = await sql`SELECT id FROM users WHERE username = 'mark'`;
    if (markExists.rows.length === 0) {
      await sql`
        INSERT INTO users (username, password, display_name)
        VALUES ('mark', ${hashedPassword}, 'Mark')
      `;
      console.log('✅ Created Mark\'s account');
    } else {
      console.log('ℹ️  Mark\'s account already exists');
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Error setting up default users:', error);
    throw error;
  }
}
