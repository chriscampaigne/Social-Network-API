const { Thoughts, Users } = require('../models');

const thoughtsController = {
    
    //create thought
    addThoughts({ params, body }, res) {
        console.log(body);
        Thoughts.create(body)
          .then(({ _id }) => {
            return Pizza.findOneAndUpdate({ _id: params.userId },{ $push: { thoughts: _id } },{ new: true });
          })
          .then(dbThoughtsData => {
            if (!dbThoughtsData) {
              res.status(404).json({ message: 'No thoughts found with this id!' });
              return;
            }
            res.json(dbThoughtsData);
          })
          .catch(err => res.json(err));
      },

      //get all thoughts
      getAllThoughts(req,res) {
        Thoughts.find({})
        .populate({path: 'thoughts',select: '-__v'
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
      deleteThoughts({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.id })
          .then(dbThoughtsData => {
            if (!dbThoughtsData) {
              res.status(404).json({ message: 'No thoughts found with this id!' });
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