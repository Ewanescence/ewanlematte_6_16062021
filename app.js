const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

const authRoutes = require('./routes/auth-routes')
const sauceRoutes = require('./routes/sauce-routes')

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://p2ko_admin:admin123@sopekocko.mspck.mongodb.net/sopekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/api/auth/', authRoutes);
app.use('/api/sauces/', sauceRoutes);
app.post('/api/sauces/', sauceRoutes);
app.put('/api/sauces/', sauceRoutes);
app.delete('/api/sauces/', sauceRoutes);

module.exports = app;