// Imports
const express = require('express'); // express : framework
const router = express.Router(); // déclaration du routeur

const auth = require('../middleware/auth-middleware'); // importation de la gestion de sécurité
const multer = require('../middleware/multer-middleware'); // importation de la gestion d'image entrante
const sauceControl = require('../controllers/sauce-controllers'); // importation du contrôleur des logiques concernant les sauces

// Routes
router.get('/', auth, sauceControl.getAllSauces); // route GET vers la logique de récupération de toutes les sauces
router.get('/:id', auth, sauceControl.getOneSauce); // route GET vers la logique de récupération d'une sauce
router.post('/', auth, multer, sauceControl.createOneSauce); // route POST vers la logique de création d'une sauce
router.put('/:id', auth, multer, sauceControl.modifyOneSauce); // route PUT vers la logique de modification d'une sauce
router.delete('/:id', auth, sauceControl.deleteOneSauce); // route DELETE vers la logique de suppression d'une sauce
router.post('/:id/like', auth, sauceControl.likeOneSauce); // route POST vers la logique de gestion des likes d'une sauce

// Export
module.exports = router; // exportation du router vers l'application