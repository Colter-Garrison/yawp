const pool = require('../utils/pool');

module.exports = class Review {
  id;
  stars;
  detail;
  restaurantId;
  userId;

  constructor(row) {
    this.id = row.id;
    this.stars = row.stars;
    this.detail = row.detail;
    this.restaurantId = row.restaurant_id;
    this.userId = row.user_id;
  }

  static async insert({ stars, detail, restaurant_id, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (stars, detail, restaurant_id, user_id)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [stars, detail, restaurant_id, user_id]
    );
    return new Review(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM reviews
      WHERE id = $1 
      RETURNING *`, [id]
    );
    return new Review(rows[0]);
  }

  static async getReviewById(id) {
    const { rows } = await pool.query(
      `SELECT reviews.* FROM reviews
      INNER JOIN users on reviews.user_id = users.id
      WHERE reviews.id = $1`, [id]
    );
    return new Review(rows[0]);
  }
};
