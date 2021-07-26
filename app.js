const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://oc_tester:gjt1wcqwFLRSRS68@clusteroc.hzjor.mongodb.net/clusterOC?retryWrites=true&w=majority',
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

app.post('/api/auth/signup', (req, res, next) => {
    res.status(200);
});

app.post('/api/auth/login', (req, res, next) => {
    res.status(200);
});

app.use('/api/sauces', (req, res, next) => {
    res.status(200);
});

app.use('/api/sauces/:id', (req, res, next) => {
    res.status(200);
});

app.post('/api/sauces', (req, res, next) => {
    res.status(200);
});

app.put('/api/sauces/:id', (req, res, next) => {
    res.status(200);
});

app.delete('/api/sauces/:id', (req, res, next) => {
    res.status(200);
});

app.post('/api/sauces/:id/like', (req, res, next) => {
    res.status(200);
});

module.exports = app;