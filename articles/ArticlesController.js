const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');

router.get('/articles', (req, res) => {
  res.send('Rotas de artigos');
});

router.get('/admin/articles/new', (req, res) => {
<<<<<<< Updated upstream
  Category.findAll().then(categories => {
    res.render('admin/articles/new', { categories: categories });
  });
  res.send('Rotas para criar uma novo artigo');
=======
  res.render('admin/articles/new');
>>>>>>> Stashed changes
});

module.exports = router;
