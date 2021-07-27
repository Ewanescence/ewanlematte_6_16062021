// Imports

const jwt = require('jsonwebtoken'); // jwt = token d'authentification

// Gestion de la sécurisation des routes

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extraction du token des entêtes de la requête
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  // Vérification du token
        const userId = decodedToken.userId; // Extraction de l'identifiant utilisateur du token 
        if (req.body.userId && req.body.userId !== userId) { // Vérification de la présence d'un identifiant utilisateur dans la requête et comparaison avec celui extrait du token
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};