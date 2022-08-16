const pool = require('../utils/pool');

class Restaurant {
  id;
  name;
  cuisine;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.cuisine = row.cuisine;
  }

  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants',
    );
    return rows.map((row) => new Restaurant(row));
  }
}

module.exports = { Restaurant };
