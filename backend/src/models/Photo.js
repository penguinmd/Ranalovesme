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
