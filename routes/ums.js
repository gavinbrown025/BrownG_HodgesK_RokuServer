const express = require('express');
const router = express.Router();
const connect = require('../config/sqlConfig');

router.use(express.json());
router.use(express.urlencoded({extended: false}));


router.post('/admin/login', (req, res) => {
    connect.query(
        `SELECT user_id, user_admin, user_access, account_id `+
        `FROM tbl_user WHERE user_name = "${req.body.username}" `+
        `AND user_pass = "${req.body.password}"`,

        (err, row) => {
        if (err) throw err;

        if (row.length) {
            res.status(200).json(row[0]);
        }  else {
            res.status(404).json({failure: true, message: 'User not found, Try again.'});
        }
    });
});

router.post('/admin/signup', (req, res) => {
    console.log(req.body)
    connect.query(
        `INSERT INTO tbl_user (user_fname, user_name, user_pass, user_email, user_admin, user_access, user_avatar, account_id) `+
        `VALUES("${req.body.fname}", "${req.body.username}", "${req.body.password}", "${req.body.email}", "${req.body.admin}", "${req.body.access}", "${req.body.avatar}", "${req.body.account}") `,

    (err, results) => {
        if (err) {
            res.status(444).json({success:false, message: 'Hmm nope. Try again.'});
            console.log(err);
        } else {
            res.json({success:true, message: 'Successfully Created Account'});
        }
    });
});

router.get('/admin/getusers/:account', (req, res) => {
    connect.query(
        `SELECT user_id, user_name, user_fname, user_admin, user_access, user_avatar, user_email `+
        `FROM tbl_user WHERE account_id =${req.params.account}`,
        function(err, results) {
        if (err) {
            res.status(444).json({message: `failure`, status: `Can't retrieve users`})
            throw err;
        }
        res.status(200).json(results);
    })
});

router.post('/adduser', (req, res) => {
    connect.query(
        `INSERT INTO tbl_user (user_fname, user_name, user_admin, user_access, user_avatar, account_id) `+
        `VALUES("${req.body.fname}", "${req.body.fname}", "${req.body.admin}", "${req.body.access}", "${req.body.avatar}", "${req.body.account}") `,

    (err, results) => {
        if (err) {
            res.status(444).json({message: `Something went wrong, try again.`})
            throw err;
        }else {
            res.status(200).json({success:true, message: 'Successfully added user'});
        }
    });
});

router.post('/edituser', (req, res) => {
    connect.query(
        `UPDATE tbl_user SET `+
        `user_fname = "${req.body.fname}", `+
        `user_name = "${req.body.fname}", `+
        `user_admin = "${req.body.admin}", `+
        `user_access = "${req.body.access}", `+
        `user_avatar = "${req.body.avatar}" `+
        `WHERE user_id = ${req.body.id}`,

    (err, results) => {
        if (err) {
            res.status(444).json({message: `Something went wrong, try again.`})
            throw err;
        }else {
            res.status(200).json({success:true, message: 'Successfully updated user'});
        }
    });
});

router.post('/deleteuser', (req, res) => {
    console.log(req.body.id);

    connect.query(
        `DELETE FROM tbl_user WHERE user_id = ${req.body.id}`,

    (err, results) => {
        if (err) {
            res.status(444).json({message: `Something went wrong, try again.`})
            throw err;
        }else {
            res.status(200).json({success:true, message: 'Successfully deleted user'});
        }
    });
});

router.get('/avatar', (req, res) => {
    connect.query(
        'SELECT * FROM tbl_avatar',
        function(err, results) {
            if (err) throw err;
            res.json(results);
        }
    );
});


module.exports = router;