// Imports

const bcrypt = require('bcrypt') // bcrypt : hash mots de passe
const jwt = require('jsonwebtoken') //jwt : token d'authentification

const User = require('../models/auth-model') // Schéma de données utilisateur

// Contrôleur d'authentification

exports.signUp = (req, res, next) => { // Logique d'inscription
    bcrypt.hash(req.body.email, 10)
        .then(hemail => {
            bcrypt.hash(req.body.password, 10) // On sale le mot de passe récupéré dans le corps de la requête 10 fois
                .then(hash => {
                    const user = new User({ // Déclaration d'un nouvel objet utilisateur
                        email: hemail, // Email récupéré dans la requête
                        password: hash // Mot de passe récupéré puis hashé 
                    });
                    user.save() // Sauvegarde de l'objet
                        .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' })) // Réponse positive à la sauvegarde
                        .catch(error => res.status(400).json({ error })); // Réponse négative à la sauvegarde
                })
                .catch(error => res.status(500).json({ error })); // Réponse négative au hashage du mot de passe 
        })
        .catch(error => res.status(500).json({ error }));

};

exports.login = (req, res, next) => { // Logique de connexion
    User.findOne({ email: req.body.email }) // Cherche un utilisateur avec l'email de la requête 
        .then(user => {
            if (!user) { 
                return res.status(401).json({ error: 'Utilisateur introuvable !' }); // Réponse négative si pas d'utilisateur trouvé
            }
            bcrypt.compare(req.body.password, user.password) // Hashage du mot de passe de la requête pour comparaison avec celui de l'utilisateur
                .then(valid => { 
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Réponse négative si mauvais mot de passe
                    }
                    res.status(200).json({ // Réponse positive si bon mot de passe
                        userId: user._id,
                        token: jwt.sign(  // Création d'un token d'authentification temporaire à l'aide de l'id utilisateur et d'une chaîne
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // Réponse négative en cas d'erreur du hashage
        })
        .catch(error => res.status(500).json({ error })); // Réponse négative à la récupération d'un utilisateur
};