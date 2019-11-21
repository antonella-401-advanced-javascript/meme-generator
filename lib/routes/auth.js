const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const { body } = req;
    const { username, password } = body;
    User
      .create({ username, password })
      .then(user => {
        res.cookie('session', user.token());
        res.send(user);
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const { body } = req;
    const { username, password } = body;
    User
      .findOne({ username })
      .then(user => {
        if(!user || !user.compare(password)) {
          const err = new Error('Invalid username or password');
          err.status = 401;
          throw err;
        }
        res.cookie('session', user.token());
        res.send(user);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });