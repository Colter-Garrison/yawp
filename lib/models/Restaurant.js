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

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    return new Restaurant(rows[0]);
  }

  async getReviews() {
    const { rows } = await pool.query(
      `SELECT reviews.* FROM restaurants
      LEFT JOIN reviews ON reviews.restaurant_id = restaurants.id
      WHERE restaurants.id = $1`,
      [this.id]
    );
    return rows;
  }
}

module.exports = { Restaurant };
