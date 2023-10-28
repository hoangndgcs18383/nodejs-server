const User = require('../models/user')
const bcrypr = require('bcrypt');
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const fileName = "users.json";

exports.get_all_account = (req, res, next) => {

    data = fs.readFileSync(fileName, 'utf8')
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
};

exports.create_account = (req, res, next) => {
    
    const user = getUserByEmail(req);
    const filePath = null;
    if(req.file !== undefined) filePath = req.file.path;

    if (user) {
        return res.status(401).json({
            message: "User has exits!"
        })
    }

    bcrypr.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        } else {

            const _id = uuidv4();
            const newUser = {
                id: _id,
                name: req.body.name,
                email: req.body.email,
                password: hash,
                userImage: filePath
            }

            const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
            data.users.push(newUser);
            fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
            res.status(200).json(getResponMessage("Create User Successfully", newUser));
        }
    })
};

exports.login_account = (req, res, next) => {
    const user = getUserByEmail(req);

    if (!user) {
        return res.status(401).json({
            error: "Account has not exit!"
        })
    }
    else {
        bcrypr.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth has failed!"
                });
            }

            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    userId: user.id
                }, 'secret', { expiresIn: "1h" })

                res.status(200).json({
                    message: "Auth success!",
                    token: token
                });
            }
            else {
                res.status(401).json({
                    message: "Auth has failed!"
                });
            }
        })
    }
};

exports.find_account = (req, res, next) => {
    const id = req.params.userId;
    const user = getUserById(id);

    if (user) {
        res.status(200).json(getResponMessage("Get UserId " + user.id + " Successfully", user));
    }
    else {
        res.status(404).json({ message: "No vaid entry" })
    }
};

exports.update_account = (req, res, next) => {
    const id = req.params.userId;
    const index = getIndexById(id);
    const updateData = getUserById(id);
    Object.assign(updateData, req.body)
    
    if (index > 0) {
        const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        data.users[index] = updateData;
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
        res.status(200).json(getResponMessage("Update UserId " + updateData.name + " Successfully", updateData));
    }
    else {
        res.status(500).json({ error: 'User not exits' })
    }
};

exports.delete_account = (req, res, next) => {
    const id = req.params.userId;
    const index = getIndexById(id);
    const updateData = getUserById(id);
    
    if (index > 0) {
        const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        data.users.splice(index, 1);
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
        res.status(200).json(getResponMessage("Delete UserId " + updateData.name + " Successfully", updateData));
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
        id: result.id,
        name: result.name,
        email: result.email,
        password: result.password,
        userImage: result.userImage,
        request: {
            type: 'GET',
            url: 'http://localhost:3000/users/' + result.id
        }
    }
}

function getUserByEmail(req) {
    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (!data) return;

    if (data.users.length > 0) {
        const user = data.users.find(e => e.email === req.body.email)
        return user;
    }

    return null;
}

function getUserById(id) {
    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (!data) return;

    if (data.users.length > 0) {
        const user = data.users.find(e => e.id === id)
        return user;
    }

    return null;
}

function getIndexById(id) {
    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (!data) return;

    if (data.users.length > 0) {
        const user = data.users.find(e => e.id === id)
        let index = data.users.indexOf(user)
        return index;
    }

    return -1;
}

