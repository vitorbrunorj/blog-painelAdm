const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render('admin/articles/index', { articles: articles });
  });
});

router.get('/admin/articles/new', (req, res) => {
  let error = req.query.error;

  Category.findAll()
    .then((categories) => {
      res.render('admin/articles/new', {
        error: error,
        categories: categories,
      });
    })
    .catch((error) => {
      res.redirect('/');
    });
});

router.get('/admin/articles/new', (req, res) => {
  let error = req.query.error;
  res.render('admin/articles/new', { error: error });
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

router.post('/articles/delete', (req, res) => {
  let id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect('/admin/articles');
      });
    } else {
      res.redirect('/admin/articles');
    }
  } else {
    res.redirect('/admin/articles');
  }
});

router.get('/admin/articles/edit/:id', (req, res) => {
  let id = req.params.id;
  let error = req.query.error;

  if (isNaN(id)) res.redirect('/admin/articles');

  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('./admin/articles/edit', {
            article: article,
            categories: categories,
            error: error,
          });
        });
      } else {
        res.redirect('/admin/articles');
      }
    })
    .catch((err) => {
      res.redirect('/admin/articles');
    });
});

router.post('/articles/update', (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  if (title == undefined || title == '') {
    res.redirect(
      '/admin/articles/edit/' +
        id +
        '?error=É necessário o título do artigo!'
    );
  } else if (body == undefined || body == '') {
    res.redirect(
      '/admin/articles/edit/' +
        id +
        '?error=É necessário escrever alguma coisa!'
    );
  } else if (category == undefined || category == '') {
    res.redirect(
      '/admin/articles/edit/' +
        id +
        '?error=É necessário selecionar uma categoria!'
    );
  } else {
    Article.update(
      { title: title, body: body, categoryId: category },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.redirect('/admin/articles');
      })
      .catch((err) => {
        res.redirect('/');
      });
  }
});

router.get('/articles/page/:num', (req, res) => {
  let page = req.params.num;
  let offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = parseInt(page) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [['id', 'DESC']],
  }).then((articles) => {
    let result = {
      articles: articles,
      page: parseInt(page),
      next: offset + 4 >= articles.count ? false : true,
    };
    res.json(result);
  });
});

module.exports = router;
