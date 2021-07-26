const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth-middleware');

const sauceControl = require('../controllers/sauce-controllers');

router.use('/', auth, sauceControl.getAllSauces);
router.use('/:id', auth, sauceControl.getOneSauce);
router.post('/', auth, sauceControl.createOneSauce);
router.put('/:id', auth, sauceControl.modifyOneSauce);
router.delete('/:id', auth, sauceControl.deleteOneSauce);
router.post('/:id/like', auth, sauceControl.likeOneSauce);

module.exports = router;