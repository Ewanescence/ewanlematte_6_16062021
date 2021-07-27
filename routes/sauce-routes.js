const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth-middleware');
const multer = require('../middleware/multer-middleware');

const sauceControl = require('../controllers/sauce-controllers');

router.get('/', auth, sauceControl.getAllSauces);
router.get('/:id', auth, sauceControl.getOneSauce);
router.post('/', auth, multer, sauceControl.createOneSauce);
router.put('/:id', auth, multer, sauceControl.modifyOneSauce);
router.delete('/:id', auth, sauceControl.deleteOneSauce);
router.post('/:id/like', auth, sauceControl.likeOneSauce);

module.exports = router;