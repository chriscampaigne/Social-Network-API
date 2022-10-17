const { Thoughts, Users } = require('../models');
const { getUsersbyId } = require('./user-controller');

const thoughtsController = {
    
    //create thought
    createThoughts({ body }, res) {
      Thoughts.create(body)
          .then(({ username, _id }) => {
              return Users.findOneAndUpdate(
                  { username: username },
                  { $push: { thoughts: _id } },
                  { new: true, runValidators: true }
              )
          })
          .then(dbUserData => {
              if (!dbUserData) {
                  res.status(404).json({ message: 'No user found at this id!' });
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },

      //get all thoughts
      getThoughts(req,res) {
        Thoughts.find({})
        .populate({path: 'reactions',select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    //get thoughts by id
    getThoughtsById({ params }, res) {
        Thoughts.findOne({ _id: params.id })
          .populate({path: 'reactions',select: '-__v'})
          .select('-__v')
          .then(dbThoughtsData => {
            if (!dbThoughtsData) {
              res.status(404).json({ message: 'No thoughts found with this id!' });
              return;
            }
            res.json(dbThoughtsData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },

      //update thought
      updateThoughts({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true, runvalidators:true })
        .populate({path: 'reactions', select: '-__v'})
        .select('-___v')
          .then(dbThoughtsData => {
            if (!dbThoughtsData) {
              res.status(404).json({ message: 'No thoughts found with this id!' });
              return;
            }
            res.json(dbThoughtsData);
          })
          .catch(err => res.status(400).json(err));
      },

      //delete thoughts
      deleteThoughts({params}, res) {
        Thoughts.findOneAndDelete({_id: params.id})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this particular ID!'});
                return;
            }
            res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },
    
      //add a reaction
      addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.thoughtId },{ $push: { reactions: body } },{ new: true, runvalidators:true})
        .populate({path: 'ractions',select:'-__v'})
        .select('-__v')
          .then(dbThoughtsData => {
            if (!dbThoughtsData) {
              res.status(404).json({ message: 'No thoughts found with this id!' });
              return;
            }
            res.json(dbThoughtsData);
          })
          .catch(err => res.status(400).json(err));
      },

      //delete reaction
      deleteReaction({ params}, res) {
        Thoughts.findOneAndDelete({ _id: params.thoughtId },{ $pull: { reactions:{reactionId: params.reactionId}}}, {new : true})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts with this id!' });
                return;
              }
            res.json(dbThoughtsData);
            })
        .catch(err => res.status(400).json(err));
        },
    }

module.exports = thoughtsController;