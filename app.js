// Imports
const express = require('express'); // Express : framework
const helmet = require('helmet'); // Helmet : securité
const dotenv = require('dotenv').config(); // Dotenv : configuration
const bodyParser = require('body-parser'); // body-parser : Parsing de données

const app = express();

const mongoose = require('mongoose'); // Mongoose : Base de données

const authRoutes = require('./routes/auth-routes') // Router en charge de l'authentification
const sauceRoutes = require('./routes/sauce-routes') // Router en charge des sauces

const path = require('path'); // Suffit à gérer une erreur suite à une déprécation

// Base de données : Remplacer les données de connexion -> mongodb+srv://<nom d'utilisateur>:<mot de passe>@<url du cluster>/<nom de la base de données>?retryWrites=true&w=majority
mongoose.set('useCreateIndex', true);
mongoose.connect(`${process.env.MONGODB_URL}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Helmet : pour sécuriser les entêtes des requêtes
app.use(helmet());

// Définition des autorisations des requêtes
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', `${process.env.REQUEST_ORIGIN}`); // Origine des requêtes autorisée
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Entêtes autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Méthodes autorisées
    res.setHeader('Access-Control-Max-Age', '86400'); // Durée de vie d'une requête
    next();
  });

app.use(bodyParser.json());

// Utilisation des routes
app.use('/api/auth/', authRoutes);
app.use('/api/sauces/', sauceRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

// Serveur
module.exports = app; // export de l'application vers le serveur