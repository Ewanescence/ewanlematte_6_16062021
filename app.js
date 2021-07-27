// Imports
const express = require('express'); // Express : framework
const bodyParser = require('body-parser'); 

const app = express();

const mongoose = require('mongoose'); // Mongoose : Base de données

const authRoutes = require('./routes/auth-routes') // Router en charge de l'authentification
const sauceRoutes = require('./routes/sauce-routes') // Router en charge des sauces

const path = require('path'); // Suffit à gérer une erreur suite à une déprécation

// Base de données : Remplacer les données de connexion -> mongodb+srv://<nom d'utilisateur>:<mot de passe>@<url du cluster>/<nom de la base de données>?retryWrites=true&w=majority
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://p2ko_editor:editor123@sopekocko.mspck.mongodb.net/sopekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Définition des autorisations des requêtes
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // Origine des requêtes autorisée
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