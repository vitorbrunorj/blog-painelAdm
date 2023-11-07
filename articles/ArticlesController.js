const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
  res.send('Rotas de artigos');
});

router.get('/admin/articles/new', (req, res) => {
  res.send('Rotas para criar uma novo artigo');
});

module.exports = router;