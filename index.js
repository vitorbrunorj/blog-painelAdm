const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

// View engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database

connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com o banco de dados!');
  })
  .catch((error) => {
    console.log('Não conectou com o banco de dados!');
  });
  

  // Routes
app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
  console.log('Acesse: http://localhost:3000');
});
