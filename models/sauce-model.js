// Imports
const mongoose = require('mongoose'); // Mongoose : base de données

// Modèle de données d'une sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Identifiant utilisateur : chaîne de caractères, requise
    name: { type: String, required: true }, // Nom de la sauce : chaîne de caractères, requise
    manufacturer: { type: String, required: true }, // Fabricant de la sauce : chaîne de caractères, requise
    description: { type: String, required: true }, // Description de la sauce : chaîne de caractères, requise
    mainPepper: { type: String, required: true },  // Epice principale : chaîne de caractères, requise
    imageUrl: { type: String, required: true }, // Source de l'image : chaîne de caractères, requise
    heat: { type: Number, required: true }, // Ardeur de la sauce : nombre, requise
    likes: { type: Number, required: true }, // Compteur de likes : nombre, requise
    dislikes: { type: Number, required: true }, // Compteur de dislikes : nombre, requise
    usersLiked: { type: [String], required: true }, // Utilisateurs ayant liké la sauce : tableau de chaînes de caractères, requise
    usersDisliked: { type: [String], required: true }, // Utilisateurs ayant disliké la sauce : tableau de chaînes de caractères, requise
});

// Export
module.exports = mongoose.model('Sauce', sauceSchema); // Export du modèle de données