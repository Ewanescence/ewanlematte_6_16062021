const fs = require('fs');

const Sauce = require('../models/sauce-model');

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => { 
      res.status(400).json({ 
        error: error 
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id 
  }).then(
    (sauce) => {
        res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({ 
        error: error 
      });
    }
  );
};

exports.createOneSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    sauceObject.usersLiked = [''];
    sauceObject.usersDisliked = [''];
    const sauce = new Sauce({
      ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyOneSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeOneSauce = (req, res, next) => {
  try {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch(req.body.like) {
        case 1 : 
          if (sauce.usersLiked.includes(req.body.userId)) {
            console.log('a déjà liké');
          } 
          else {
            console.log('n\'a pas liké');
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
          }
          break
        case 0 :
          if (sauce.usersLiked.includes(req.body.userId)) {
            sauce.likes--;
            const index = sauce.usersLiked.indexOf(req.body.userId);
            sauce.usersLiked.splice(index, 1);
          }
          else if (sauce.usersDisliked.includes(req.body.userId)) {
            sauce.dislikes--;
            const index = sauce.usersDisliked.indexOf(req.body.userId);
            sauce.usersDisliked.splice(index, 1);
          }
          break
        case -1 :
          if (sauce.usersDisliked.includes(req.body.userId)) {
            console.log('a déjà disliké');
          } 
          else {
            console.log('n\'a pas disliké');
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
          }
          break
      }
      sauce.save();
      res.status(200).json({ message: 'Like ajouté'}) 
    })
    .catch(error => res.status(500).json({ error }));
  } catch (error) {
    next(error)
  }

}