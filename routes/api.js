const express = require('express');
const router = express.Router();
const connect = require('../config/sqlConfig');


//? this is the /api/movies route handler
router.get('/movies/:access', (req, res) => {
    connect.getConnection((err, connection) => {
        connection.query(
            `SELECT m.*, `+
            `GROUP_CONCAT(DISTINCT g.genre_name) AS movies_genre, `+
            `a.arating_id AS movies_arating `+

            `FROM tbl_movies m `+

            `LEFT JOIN tbl_mov_genre AS glink `+
            `ON glink.movies_id = m.movies_id `+
            `LEFT JOIN tbl_genre AS g `+
            `ON g.genre_id = glink.genre_id `+

            `LEFT JOIN tbl_mov_arating AS alink `+
            `ON alink.movies_id = m.movies_id `+
            `LEFT JOIN tbl_arating AS a `+
            `ON a.arating_id = alink.arating_id `+

            `WHERE a.arating_id <= ${req.params.access} `+
            `GROUP BY m.movies_id`,

            (error, results) => {
                connection.release();
                if (error) throw error;

                for (let object in results){
                    results[object].movies_genre = results[object].movies_genre.split(",");
                }

                res.json(results);
            }
        );
    });

});

// dynamic route handler that accepts a param (:id)
// passing in via the route:: /api/movies/1, /api/movies/20
router.get('/movies/select/:id', (req, res) => {
    connect.getConnection((err, connection) => {
        connection.query(

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

            (err, results) => {
                connection.release();
                if (err) throw err;

                for (let object in results){
                    results[object].movies_genre = results[object].movies_genre.split(",");
                    results[object].movies_cast = results[object].movies_cast.split(",");
                }

                res.json(results[0]);

            }
        );
    });
});

router.get('/movies/:access/:genre', (req, res) => {
    connect.getConnection((err, connection) => {
        connection.query(
            `SELECT m.*, `+
            `GROUP_CONCAT(DISTINCT g.genre_name) AS movies_genre, `+
            `a.arating_id AS movies_arating `+

            `FROM tbl_movies m `+

            `LEFT JOIN tbl_mov_genre AS glink `+
            `ON glink.movies_id = m.movies_id `+
            `LEFT JOIN tbl_genre AS g `+
            `ON g.genre_id = glink.genre_id `+

            `LEFT JOIN tbl_mov_arating AS alink `+
            `ON alink.movies_id = m.movies_id `+
            `LEFT JOIN tbl_arating AS a `+
            `ON a.arating_id = alink.arating_id `+

            `WHERE g.genre_name LIKE "%${req.params.genre}%" `+
            `AND a.arating_id <= ${req.params.access} `+
            `GROUP BY m.movies_id`,

            (error, results) => {
                connection.release();
                if (error) throw error;

                for (let object in results){
                    if (results[object].movie_genre){
                        results[object].movie_genre = results[object].movie_genre.split(",");
                    }
                }

                res.json(results);
            }
        );
    });

});

router.get('/getcomments/:id', (req, res) => {
    connect.getConnection((err, connection) => {
        connection.query(

            `SELECT * FROM tbl_comments WHERE movies_id = ${req.params.id}`,

            (error, results) => {
                connection.release();
                if (error) throw error,
                res.json(results);
            }
        )
    });
});


router.post('/comment', (req, res) => {
    console.log(req.body);

    //! this is bullshit. Its exactly the same as adduser but with different names
    //! theres no reason it shouldnt work. fuck this body undefined bullshit
    //! I've rewrote it like 5 times It has to be a glitch at his point..

    // connect.query(
    //     `INSERT INTO tbl_comments (user_name, comment, movies_id, time) `+
    //     `VALUES ("${req.body.name}","${req.body.comment}", "${req.body.movie}", now() )`,

    // (err, results) => {
    //     if (err) {
    //         res.status(444).json({message: `Something went wrong, try again.`})
    //         throw err;
    //     }else {
    //         res.status(200).json({success:true, message: 'Successfully added user'});
    //     }
    // });
});

router.get('/genre', (req, res) => {
    connect.query(
        'SELECT * FROM tbl_genre',
        function(err, results) {
            if (err) throw err;
            res.json(results);
        }
    );
});


module.exports = router;