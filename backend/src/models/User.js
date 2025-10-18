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
