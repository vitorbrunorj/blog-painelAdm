const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
  res.send('Rotas de categorias');
});

router.get('/admin/categories/new', (req, res) => {
  res.send('Rotas para criar uma nova categoria');
});

module.exports = router;