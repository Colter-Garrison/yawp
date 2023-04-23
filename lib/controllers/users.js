const { Router } = require ('express');
const UserService = require('../services/UserService');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const [user, token] = await UserService.create(req.body);
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
        .json(user);
    } catch (error) {
      next(error);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      }).json({ message: 'signed in successfully' });
    } catch (e) {
      next(e);
    }
  })
  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const getUsers = await User.getAll();
      res.send(getUsers);
    } catch (e) {
      next(e);
    }
  });
