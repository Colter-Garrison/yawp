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
};
