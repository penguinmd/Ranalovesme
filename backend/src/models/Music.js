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
