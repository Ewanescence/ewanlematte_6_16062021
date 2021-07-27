// Imports

const fs = require('fs'); // fs : suppression d'un fichier

const Sauce = require('../models/sauce-model'); // Schéma de données d'une sauce

// Contrôleur des logiques concernant les sauces

exports.getAllSauces = (req, res, next) => { // Récupération de toutes les sauces
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces); // Réponse positive si récupération des sauces
    }
  ).catch(
    (error) => { 
      res.status(400).json({  // Réponse négative si impossibilité de récupérer les sauces
        error: error 
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => { // Récupération d'une sauce à l'aide de son identifiant en paramètre
  Sauce.findOne({
    _id: req.params.id 
  }).then(
    (sauce) => {
        res.status(200).json(sauce); // Réponse positive si récupération de la sauce
    }
  ).catch(
    (error) => {
      res.status(404).json({ // Réponse négative si impossibilité de récupérer la sauce
        error: error 
      });
    }
  );
};

exports.createOneSauce = (req, res, next) => { // Création d'une nouvelle sauce
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id; 
    sauceObject.likes = 0; // Initialisation des champs requis non-renseignés par l'utilisateur
    sauceObject.dislikes = 0;
    sauceObject.usersLiked = [''];
    sauceObject.usersDisliked = [''];
    const sauce = new Sauce({ // Déclaration d'un nouvel objet Sauce
      ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Récupération de l'image
    });
    sauce.save() // Sauvegarde de l'objet sauce
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'})) // Réponse positive si sauvegarde complète
        .catch(error => res.status(400).json({ error })); // Réponse négative si sauvegarde incomplète
};

exports.modifyOneSauce = (req, res, next) => { // Modification d'une sauce
    const sauceObject = req.file ? // Vérification téléchargement d'une image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Si image, on gère la nouvelle image
    } : { ...req.body };  // Sinon, on passe directement le corps de la requête
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Mise à jour de la sauce 
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) // Réponse positive si mise à jour complète
    .catch(error => res.status(400).json({ error })); // Réponse négative si mise à jour incomplète
};

exports.deleteOneSauce = (req, res, next) => { // Suppression d'une sauce
    Sauce.findOne({ _id: req.params.id }) // Récupération de la sauce par identifiant
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; // Suppression de l'image associée à la sauce
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // Suppression
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'})) // Réponse positive si suppression complète
          .catch(error => res.status(400).json({ error })); // Réponse négative si suppression incomplète
      });
    })
    .catch(error => res.status(500).json({ error })); // Réponse négative si récupération de la sauce incomplète
};

exports.likeOneSauce = (req, res, next) => { // Gestion des likes d'une sauce
  try {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch(req.body.like) {
        case 1 : // Si dans le corps de la requête, like = 1 -> Like
          if (sauce.usersLiked.includes(req.body.userId)) { // Si l'identifiant de l'utilisateur est présent dans le tableau des utilisateurs ayant liké, on bloque le like
            res.status(400).json({ error });
          } 
          else { // Sinon ... 
            sauce.likes++; // ... incrémentation du compteur de likes ...
            sauce.usersLiked.push(req.body.userId); // ... ajout de l'identifiant utilisateur ...
            res.status(201).json({ message: 'Like ajouté'})  // ... envoi d'une réponse positive 
          }
          break
        case 0 : // Si dans le corps de la requête, like = 0 -> Annulation like/dislike
          if (sauce.usersLiked.includes(req.body.userId)) { // Vérification de la présence de l'utilisateur dans le tableau des utilisateurs ayant liké ...
            sauce.likes--; // ... décrémentation du compteur de likes ...
            const index = sauce.usersLiked.indexOf(req.body.userId); // ... récupération de l'index de l'id utilisateur correspondant ...
            sauce.usersLiked.splice(index, 1); // ... suppression de l'id du tableau des utilisateurs ayant liké ...
            res.status(201).json({ message: 'Like retiré'}) // ... réponse positive si like retiré
          }
          else if (sauce.usersDisliked.includes(req.body.userId)) { // Sinon, vérification de la présence de l'utilisateur dans le tableau des utilisateurs ayant liké ...
            sauce.dislikes--; // ... décrémentation du compteur de dislikes ...
            const index = sauce.usersDisliked.indexOf(req.body.userId); // ... récupération de l'index de l'id utilisateur correspondant ...
            sauce.usersDisliked.splice(index, 1); // ... suppression de l'id du tableau des utilisateurs ayant disliké ...
            res.status(201).json({ message: 'Dislike retiré'}) // ... réponse positive si dislike retiré
          }
          break
        case -1 : // Si dans le corps de la requête, like = -1 -> Dislike
          if (sauce.usersDisliked.includes(req.body.userId)) { // Si l'identifiant de l'utilisateur est présent dans le tableau des utilisateurs ayant disliké, on bloque le dislike
            res.status(400).json({ error });
          } 
          else { // Sinon ...
            sauce.dislikes++; // ... incrémentation du compteur de dislikes ...
            sauce.usersDisliked.push(req.body.userId); // ... ajout de l'identifiant utilisateur ...
            res.status(201).json({ message: 'Dislike ajouté'}) // ... envoi d'une réponse positive 
          }
          break
      }
      sauce.save(); // Mise à jour de la sauce après chaque action appelée
    })
    .catch(error => res.status(500).json({ error })); // Réponse négative si récupération de la sauce impossible
  } catch (error) {
    next(error)
  }

}