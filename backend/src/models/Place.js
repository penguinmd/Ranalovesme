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
