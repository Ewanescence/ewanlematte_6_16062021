const express = require('express');
const router = express.Router();

const userControl = require('../controllers/auth-controllers')

router.post('/api/auth/signup', userControl.signUp);
router.post('/api/auth/login', userControl.login);

module.exports = router;