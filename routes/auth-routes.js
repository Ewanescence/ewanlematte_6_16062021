const express = require('express');
const router = express.Router();

const userControl = require('../controllers/auth-controllers')

router.post('/signup', userControl.signUp);
router.post('/login', userControl.login);

module.exports = router;