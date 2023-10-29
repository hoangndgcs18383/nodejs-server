const User = require('../models/user')
const bcrypr = require('bcrypt');
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const fileName = "users.json";

exports.get_all_account = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json(users);
};

exports.create_account = async (req, res, next) => {
    try {
        const user = await User.create({ ...req.body })
        const token = user.createJWT();
        res.status(201).json({ message: "Create Account Success", token: token })
    } catch (err) {
        res.status(500).json({ message: err })
    }
};

exports.login_account = async (req, res, next) => {
    const em = req.body.em;
    const pa = req.body.pa;
    const user = await User.findOne({em});

    if (!user) {
        return res.status(401).json({
            error: "Account has not exit!"
        })
    }
    else {
        const isPasswoodCorrect = await user.comparePassword(pa)
        if(isPasswoodCorrect){
            const token = user.createJWT();
            res.status(200).json({
                message: "Auth success!",
                token: token
            });
        }
        else {
            res.status(500).json({
                message: "Passwood is not correct"
            });
        }
    }
};

exports.find_account = async (req, res, next) => {
    const id = req.params.userId;
    const user = await User.findById(id)
    if (user) {
        res.status(200).json(getResponMessage("Get UserId " + user._id + " Successfully", user));
    }
    else {
        res.status(404).json({ message: "No vaid entry" })
    }
};

exports.update_account = async (req, res, next) => {
    const id = req.params.userId;
    const user = await User.findByIdAndUpdate({_id: id}, req.body, {new: true, runValidators: true})
    if (user) {
        res.status(200).json(getResponMessage("Update UserId " + user.name + " Successfully", user));
    }
    else {
        res.status(500).json({ error: 'User not exits' })
    }
};

exports.delete_account = async (req, res, next) => {
    const id = req.params.userId;
    const user = await User.findByIdAndRemove({_id: id})
    if (user) {
        res.status(200).json(getResponMessage("Delete UserId " + user.name + " Successfully", user));
    }
    else {
        res.status(500).json({ error: 'User not exits' })
    }
};

function getResponMessage(message, result) {
    return {
        message: message,
        result: getResponse(result)
    }
}

function getResponse(result) {
    return {
        id: result._id,
        name: result.na,
        email: result.em,
        password: result.pa,
        userImage: result.av,
        request: {
            type: 'GET',
            url: 'http://localhost:3000/users/' + result._id
        }
    }
}
