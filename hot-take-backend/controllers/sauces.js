const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');
  const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description:req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + '/images/' + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce added Successfully!'
      });
    }
    ).catch(
      (error) => {
        res.status(400).json({
          error:error
        });
      }
    );  
}

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({_id: req.params._id});
  if(req.file){
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    sauce = {
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description:req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat
    };
  }else{
    sauce = {
      _id: req.params.id,
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description:req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat
    };
  }
  
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'Sauce updated Successfully!'
        });
      }
  ).catch(
      (error) => {
        res.status(400).json({
        error: error
        });
      } 
  );
}

exports.likeSauce = (req, res, next) => {
  let like = req.body.like;
  let sauce = new Sauce({_id: req.params._id});
  if(like == 1){
    sauce = {
      _id: req.params.id,
      $inc: {likes: 1},
      $push: {usersLiked: req.body.userId}
    }
  }
  if(like == 0){
    const cursorLikes = Sauce.find({usersLiked: req.body.userId});
    const cursorDislikes = Sauce.find({usersDisliked: req.body.userId});
    if(cursorDislikes){
      sauce = {
        _id: req.params.id,
        $inc: {dislikes: -1},
        $pull: {usersDisliked: req.body.userId}
      }
    }
    if(cursorLikes){
        sauce = {
        _id: req.params.id,
        $inc: {likes: -1},
        $pull: {usersLiked: req.body.userId}
      }
      }
  }
  if(like == -1){
    sauce = {
      _id: req.params.id,
      $inc: {dislikes: 1},
      $push: {usersDisliked: req.body.userId}
    }
  }
  Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'Sauce liked Successfully!'
        });
      }
  ).catch(
    (error) => {
      res.status(400).json({
      error: error
      });
    } 
  );
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id }).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Sauce deleted Successfully!'
            });
          }
          ).catch(
            (error) => {
              res.status(400).json({
              error: error
              });
            } 
          );
      })
    }
  );
}

exports.getSauce = (req, res, next) => {
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
}

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
}