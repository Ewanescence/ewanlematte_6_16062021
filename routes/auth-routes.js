// Imports
const express = require('express'); // express : framework
const router = express.Router(); // déclaration du routeur

const userControl = require('../controllers/auth-controllers') // importation du contrôleur d'authentification

// Routes 
router.post('/signup', userControl.signUp); // route POST vers la logique d'inscription
router.post('/login', userControl.login); // route POST vers la logique de connexion

// Export
module.exports = router; // exportation du router vers l'application