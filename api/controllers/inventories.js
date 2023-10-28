const Inventory = require('../models/inventory');
const User = require('../models/user')
const mongoose = require('mongoose');

exports.inventories_get_all = (req, res, next) => {
    Inventory.find().exec().then(docs => {
        const response = {
            count: docs.length,
            inventories: docs.map(doc => {
                return {
                    _id: doc._id,
                    users: {
                        userId: doc.userId,
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + doc.userId
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/inventories/' + doc._id
                    }
                }
            })
        }

        if (docs.length >= 0) {
            res.status(200).json(response);
        }
        else {
            res.status(404).json({ message: "No entries found" })
        }

    }).catch(e => {
        console.log(e);
        res.status(500).json({ error: e })
    });
};

exports.create_inventory_account = (req, res, next) => {
    //search for userId
    User.findById((req.userData.userId)).then((user) => {
        findInventoryByUserId(user);
    }).then((result) => {
        res.status(201).json({
            message: "Create inventory successfully",
            results: result
        });
    }).catch(e => {
        res.status(500).json({
            error: e,
            message: 'User not found'
        });
    })
}

exports.find_inventory_account = (req, res, next) => {
    const id = req.params.inventoryId;
    Inventory.findById(id).exec().then(doc => {
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({ message: "No vaid entry" })
        }

    }).catch(e => {
        console.log(e);
        res.status(500).json({ error: e })
    });
}

exports.update_inventory_account = (req, res, next) => {
    const id = req.params.inventoryId;
    User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({ error: err }))
}

exports.delete_inventory_account = (req, res, next) => {
    const id = req.params.inventoryId;

    Inventory.findByIdAndRemove(id).exec().then(result => {
        const response = {
            message: "Delete inventory success",
            inventories: {
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/inventories'
                }
            }
        }

        res.status(200).json(response);
    }).catch(e => {
        console.log(e);
        res.status(500).json({ error: e })
    })
}

function findInventoryByUserId(user) {
    if (!user) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const inventory = new Inventory({
        _id: new mongoose.Types.ObjectId(),
        userId: user._id
    })

    return inventory.save();
}
