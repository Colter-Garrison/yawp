const { Router } = require('express');
const { Restaurant } = require('../models/Restaurant');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const getRestaurants = await Restaurant.getAll();
      res.json(getRestaurants);
    } catch (e) {
      next(e);
    }
  });
