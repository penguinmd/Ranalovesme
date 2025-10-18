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
