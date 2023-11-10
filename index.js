const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

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
  Article.findAll({
    order: [['id', 'DESC']],
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', { articles: articles, categories: categories });
    });
  });
});

app.get('/:slug', (req, res) => {
  let slug = req.params.slug;
  Article.findOne({
    where: { slug: slug },
  })
    .then((articles) => {
      if (articles != undefined) {
        Category.findAll().then((categories) => {
          res.render('article', {
            article: articles,
            categories: categories,
          });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
  let slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render('index', {
            articles: category.articles,
            categories: categories,
          });
        });


      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      res.redirect('/');
    });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
  console.log('Acesse: http://localhost:3000');
});
