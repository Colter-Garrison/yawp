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
  })
  .get('/:restId', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getById(req.params.restId);
      restaurant.reviews = (await restaurant.getReviews()) ?? [];
      res.json(restaurant); 
    } catch (e) {
      next(e);
    }
  });
