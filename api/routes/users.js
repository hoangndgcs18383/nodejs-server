const express = require('express');
const routes = express.Router();
const multer = require('multer');

const UsersController = require('../controllers/users')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

//Get All : /users
routes.get('/', UsersController.get_all_account);
//Post : /users/signup
routes.post('/signup', upload.single('userImage'), UsersController.create_account);
//Post : /users/login
routes.post('/login', upload.single('userImage'), UsersController.login_account);
//Get UserId : /users/{userId}
routes.get('/:userId', UsersController.find_account);
//Patch UserId : /users/{userId}
routes.patch('/:userId', UsersController.update_account);
//Delete UserId : /users/{userId}
routes.delete('/:userId', UsersController.delete_account);

module.exports = routes;