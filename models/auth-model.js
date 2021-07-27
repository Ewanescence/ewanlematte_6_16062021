// Imports
const mongoose = require('mongoose'); // Mongoose : base de données
const uniqueValidator = require('mongoose-unique-validator'); // uniqueValidator : vérification du statut unique d'un champ de données

// Modèle de données d'un utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Chaîne de caractères, requise et unique
    password: { type: String, required: true }, // Chaîne de caractères et requise
});

// Vérification paramètre unique
userSchema.plugin(uniqueValidator);

// Export
module.exports = mongoose.model('User', userSchema); // export du modèle de données