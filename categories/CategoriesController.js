const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const Article = require('../articles/Article');

router.get('/admin/categories/new', (req, res) => {
  let error = req.query.error;
  res.render('admin/categories/new', { error: error });
});

router.post('/articles/save', (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  if (title == undefined || title == '') {
    res.redirect(
      '/admin/articles/new?error=É necessário o título do artigo!'
    );
  } else if (body == undefined || body == '') {
    res.redirect(
      '/admin/articles/new?error=É necessário escrever alguma coisa!'
    );
  } else if (category == undefined || category == '') {
    res.redirect(
      '/admin/articles/new?error=É necessário selecionar uma categoria!'
    );
  } else {
    Article.create({
      title: title,
      slug: slugify(title),
      body: body,
      categoryId: category,
    }).then(() => {
      res.redirect('/admin/articles');
    });
  }
});

router.get('/admin/categories', (req, res) => {
  Category.findAll().then((categories) => {
    res.render('./admin/categories/index', { categories: categories });
  });
});

router.post('/categories/delete', (req, res) => {
  let id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect('/admin/categories');
      });
    } else {
      res.redirect('/admin/categories');
    }
  } else {
    res.redirect('/admin/categories');
  }
});

router.get('/admin/categories/edit/:id', (req, res) => {
  let id = req.params.id;
  let error = req.query.error;
  console.log(`ID: ${id}`); // Log the ID

  if (isNaN(id)) res.redirect('/admin/categories');

  Category.findByPk(id)
    .then((category) => {
      console.log(`Category: ${JSON.stringify(category)}`); // Log the category
      if (category != undefined) {
        res.render('./admin/categories/edit', {
          category: category,
          error: error,
        });
      } else {
        res.redirect('/admin/categories');
      }
    })
    .catch((err) => {
      console.log(`Error: ${err}`); // Log any errors
      res.redirect('/admin/categories');
    });
});

router.post('/categories/update', (req, res) => {
  let id = req.body.id;
  let title = req.body.title;

  if (title != undefined && title != '') {
    Category.findOne({ where: { title: title } }).then((category) => {
      if (category != null && category.id != id) {
        res.redirect(
          '/admin/categories/edit/' +
            id +
            '?error=Essa categoria já existe!'
        );
      } else {
        Category.update(
          { title: title, slug: slugify(title) },
          { where: { id: id } }
        ).then(() => {
          res.redirect('/admin/categories');
        });
      }
    });
  } else {
    res.redirect(
      '/admin/categories/edit/' +
        id +
        '?error=É necessário o título da categoria!'
    );
  }
});

module.exports = router;
