const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
    },

    // get individual user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID'});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },

    // create a user
    createUser({ body }, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
    },

    // update user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // remove user
    removeUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
        .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "No user found with this ID" });
              return;
            }
            res.json(dbUserData);
            return Thought.deleteMany({ username: dbUserData.username });
        })
        .catch((err) => res.status(400).json(err));
    },

    // add friend
    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: { body, friendId: params.friendId } } },
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this ID" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },

    // remove friend
    removeFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.userId },
            { $pull: { friends: { friendId: params.friendId } } },
            { new: true }
        )
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    }
};

module.exports = userController;