const express = require('express');
const router = express.Router();
const user = require('../controllers/Auth/UserController');

router.get('/login', user.get_login);

router.get('/register', user.get_register);

router.post('/register', user.post_register);

router.post('/login', user.post_login);

router.get('/logout', user.logout);

module.exports = router;
