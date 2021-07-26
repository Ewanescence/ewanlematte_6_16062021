const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauce-controllers')

router.use('/api/sauces', sauceControl.getAllSauces);
router.use('/api/sauces/:id', sauceControl.getOneSauce);
router.post('/api/sauces', sauceControl.createOneSauce);
router.put('/api/sauces/:id', sauceControl.modifyOneSauce);
router.delete('/api/sauces/:id', sauceControl.deleteOneSauce);
router.post('/api/sauces/:id/like', sauceControl.likeOneSauce);

module.exports = router;