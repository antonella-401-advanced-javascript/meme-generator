const { Router } = require('express');
const Meme = require('../models/Meme');

module.exports = Router()
  .post('/', (req, res, next) => {
    Meme.create(req.body)
      .then(meme => {
        return res.json(meme);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Meme.find()
      .then(meme => {
        return res.json(meme);
      })
      .catch(next);
  });