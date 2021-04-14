const express = require('express');
const router = express.Router();

const connect = require('../config/sqlConfig');


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
// passing in via the route:: /api/movies/1, /api/movies/20
router.get('/movies/:id', (req, res) => {

    connect.query(

        `SELECT m.*, `+
        `GROUP_CONCAT(DISTINCT g.genre_name) AS movies_genre, `+
        `GROUP_CONCAT(DISTINCT c.cast_name) AS movies_cast, `+
        `s.studio_name AS movies_studio, `+
        `d.director_name AS movies_director, `+
        `a.arating_name AS movies_arating `+

        `FROM tbl_movies m `+

        `LEFT JOIN tbl_mov_genre AS glink `+
        `ON glink.movies_id = m.movies_id `+
        `LEFT JOIN tbl_genre AS g `+
        `ON g.genre_id = glink.genre_id `+

        `LEFT JOIN tbl_mov_cast AS clink `+
        `ON clink.movies_id = m.movies_id `+
        `LEFT JOIN tbl_cast AS c `+
        `ON c.cast_id = clink.cast_id `+

        `LEFT JOIN tbl_mov_studio AS slink `+
        `ON slink.movies_id = m.movies_id `+
        `LEFT JOIN tbl_studio AS s `+
        `ON s.studio_id = slink.studio_id `+

        `LEFT JOIN tbl_mov_director AS dlink `+
        `ON dlink.movies_id = m.movies_id `+
        `LEFT JOIN tbl_director AS d `+
        `ON d.director_id = dlink.director_id `+

        `LEFT JOIN tbl_mov_arating AS alink `+
        `ON alink.movies_id = m.movies_id `+
        `LEFT JOIN tbl_arating AS a `+
        `ON a.arating_id = alink.arating_id `+

        `WHERE m.movies_id = ${req.params.id}`
        ,

        function (error, results) {
        if (error) throw error;

        for (let object in results){
            results[object].movies_genre = results[object].movies_genre.split(",");
            results[object].movies_cast = results[object].movies_cast.split(",");
        }

        res.json(results[0]);

    });
});

module.exports = router;