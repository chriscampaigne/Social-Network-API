const { Users } = require('../models');

const usersController = {

    //creates
    createUsers({body}, res) {
        Users.create(body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => res.status(400).json(err));
    },
    
    //gets all
    getAllUsers(req,res) {
        Users.find({})
        .populate({path: 'comments', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    },

    //gets by id
    getUsersbyId({ params}, res) {
        Users.findOne({_id:params.id})
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUsersData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
    },

    //update user
    updateUsers({ params, body}, res) {
        Users.findOneAndUpdate({_id: params.id}, body, { new:true, runvalidators:true})
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({message: 'No users found with this id' });
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(400).json(err));
    },

    //delete users
    deleteUsers({ params }, res) {
        Users.findOneAndDelete({ _id: params.id })
          .then(dbUsersData => {
            if (!dbUsersData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUsersData);
          })
          .catch(err => res.status(400).json(err));
      },
    }



module.exports = usersController;