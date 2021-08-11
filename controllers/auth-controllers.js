// Imports

const bcrypt = require('bcrypt') // bcrypt : hash mots de passe
const jwt = require('jsonwebtoken') //jwt : token d'authentification

const User = require('../models/auth-model') // Schéma de données utilisateur

// Contrôleur d'authentification

exports.signUp = (req, res, next) => { // Logique d'inscription
    bcrypt.hash(req.body.email, 10) // On sale l'e-mail récupérée dans le corps de la requête 10 fois
        .then(hash => {
            const user = new User({ // Déclaration d'un nouvel objet utilisateur
                email: hash, // Email récupéré dans la requête puis hashé
                password: 'test' // Mot de passe basique, il sera écrasé ensuite
            });
            bcrypt.hash(req.body.password, 10) // On sale le mot de passe récupéré dans le corps de la requête 10 fois
            .then(hash => {
                user.password = hash // On écrase le paramètre password avec notre hash du mot de passe
                user.save() // Sauvegarde de l'objet user
                    .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' })) // Réponse positive à la sauvegarde
                    .catch(error => res.status(400).json({ error })); // Réponse négative à la sauvegarde
            })
            .catch(error => res.status(500).json({ error })); // Réponse négative au hashage du mot de passe
        })
        .catch(error => res.status(500).json({ error })); // Réponse négative au hashage de l'adresse email
};

exports.login = async (req, res, next) => { // Logique de connexion
    User.find() // Cherche un utilisateur avec l'email de la requête 
        .then(user => {
            user.forEach(async (user) => {
                const valid = await bcrypt.compare(req.body.email, user.email)
                if (valid) { 
                    await User.findOne({ email: user.email })
                        .then(async (user) => {
                            await bcrypt.compare(req.body.password, user.password)
                            .then(valid => {
                                if(valid) {
                                    res.status(200).json({
                                        userId: user._id,
                                        token: jwt.sign(
                                            { userId: user._id },
                                            'RANDOM_TOKEN_SECRET',
                                            { expiresIn: '24h' }
                                        )
                                    });
                                }
                                else {
                                    return res.status(401).json({ error: 'Mot de passe incorrect' }); // Réponse négative si mauvais mot de
                                }
                            })
                            .catch(error => res.status(401).json({ error })); // Réponse négative si erreur lors de la comparaison des mots de passe
                        })
                        .catch(error => res.status(401).json({ error })); // Réponse négative si erreur lors de la récupération de l'utilisateur
                }
            })
        })
        .catch(error => res.status(500).json({ error })); // Réponse négative à la récupération d'un utilisateur
};