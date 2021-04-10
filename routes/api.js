const express = require('express');
const router = express.Router();

const connect = require('../config/sqlConfig');

router.get('/', (req, res) => {
    res.json({message: "you hit the api route!"});
});

//? this is the /api/movies route handler
router.get('/movies', (req, res) => {
    connect.getConnection(function (err, connection) {

        if (err) throw err;

        connection.query(
            //"SELECT m.*, GROUP_CONCAT(g.genre_name) as genre_name FROM tbl_movies m NATURAL LEFT JOIN tbl_genre g NATURAL JOIN tbl_mov_genre GROUP BY m.movies_id",

            'SELECT m.*,GROUP_CONCAT(g.genre_name) AS movie_genre '+
            'FROM tbl_movies m '+
            'LEFT JOIN tbl_mov_genre link ON link.movies_id = m.movies_id '+
            'LEFT JOIN tbl_genre g ON g.genre_id = link.genre_id '+
            'GROUP BY m.movies_id',

            function (error, results) {
            connection.release();
            if (error) throw error;

            for (let object in results){
                if (results[object].movie_genre){
                    results[object].movie_genre = results[object].movie_genre.split(",");
                }
            }

            res.json(results);
        });
    });

});


// dynamic route handler that accepts a param (:id)
// like $_GET['id'] => (req.params.id)
// passing in via the route:: /api/movies/1, /api/movies/20
router.get('/movies/:id', (req, res) => {

    connect.query(

        `SELECT * FROM tbl_movies WHERE movies_id=${req.params.id}`,

        function (error, results) {
        if (error) throw error;

        res.json(results[0]);

    });
});

module.exports = router;