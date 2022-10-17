const router = require('express').Router();

const {
    getAllUsers,
    getUsersbyId,
    createUsers,
    updateUsers,
    deleteUsers,
    addFriend,
    deleteFriend
   
} = require('../../controllers/user-controller');



router.route('/').get(getAllUsers).post(createUsers);


router.route('/:id').get(getUsersbyId).put(updateUsers).delete(deleteUsers);


router.route('/:id/friends/:friendId').post(addFriend).delete(deleteFriend)



module.exports = router; 