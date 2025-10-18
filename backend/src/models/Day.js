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
