const User = require('../models/user-model')

exports.signUp = (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });

    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré !'}))
        .catch(error => res.status(400).json({ error }))
};

exports.login = (req, res, next) => {
    res.status(200);
};