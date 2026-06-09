var express = require('express');
var router = express.Router();
var db = require('../database');


router.get('/', function(req, res, next) {
    try {
        const rows = db.prepare('SELECT * FROM movie').all();
        res.render('movie/index', { movies: rows });
    } catch (err) {
        next(err);
    }
});


router.get('/new', function(req, res, next) {
    res.render('movie/new', { movie: {} });
});


router.post('/new', function(req, res, next) {
    try {
        const { title, director, year, description, rating } = req.body;

        const result = db
            .prepare('INSERT INTO movie (title, director, year, description, rating) VALUES (?, ?, ?, ?, ?)')
            .run(title, director, year, description, rating);

        res.redirect('/movies/' + result.lastInsertRowid);
    } catch (err) {
        next(err);
    }
});


router.get('/:id', function(req, res, next) {
    try {
        const row = db.prepare('SELECT * FROM movie WHERE id = ?').get(parseInt(req.params.id));
        if (!row) {
            return res.status(404).send('Movie not found');
        }
        res.render('movie/show', { movie: row });
    } catch (err) {
        next(err);
    }
});


router.get('/:id/edit', function(req, res, next) {
    try {
        const row = db.prepare('SELECT * FROM movie WHERE id = ?').get(parseInt(req.params.id));
        if (!row) {
            return res.status(404).send('Movie not found');
        }
        res.render('movie/edit', { movie: row });
    } catch (err) {
        next(err);
    }
});

router.post('/:id/edit', function(req, res, next) {
    try {
        const { title, director, year, description, rating } = req.body;
        db.prepare('UPDATE movie SET title = ?, director = ?, year = ?, description = ?, rating = ? WHERE id = ?')
          .run(title, director, year, description, rating, parseInt(req.params.id));
        res.redirect('/movies/' + req.params.id);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/delete', function(req, res, next) {
    try {
        db.prepare('DELETE FROM movie WHERE id = ?').run(parseInt(req.params.id));
        res.redirect('/movies');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
