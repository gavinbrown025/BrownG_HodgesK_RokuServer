const express = require('express');
const router = express.Router();
const connect = require('../config/sqlConfig');

router.get('/', (req, res) => {
    res.json({message: "you hit the UMS route!"});
});

router.use(express.json());
router.use(express.urlencoded({extended: false}));


router.post('/admin/login', (req, res) => {
    connect.query(
        `SELECT user_id, user_admin, user_access
        FROM tbl_user WHERE user_name = "${req.body.username}" 
        AND user_pass = "${req.body.password}"`,
        (err, row) => {
        if (err) throw err;

        if (row.length) {
            res.status(200).json(row[0]);
        }  else {
            res.status(404).json({failure: true, message: 'User not found, Try again.'});
        }
    });
});

router.get('/admin/getusers', (req, res) => {
    connect.query(
        'SELECT user_id, user_name, user_fname, user_admin, user_access, user_avatar FROM tbl_user',
        function(err, results) {
        if (err) {
            res.status(444).json({message: `failure`, status: `can't retrieve users`})
            throw err;
        }

        res.status(200).json(results);

    })
});

module.exports = router;