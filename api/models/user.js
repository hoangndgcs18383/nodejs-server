const mongoose = require('mongoose');
const bcrypr = require('bcrypt');
const jwt = require('jsonwebtoken')

class User {
    constructor(id, name, userImage, email, password) {
        this.id = id,
            this.name = name,
            this.userImage = userImage,
            this.email = email,
            this.password = password
    }
}

const UserSchema = new mongoose.Schema({
    na: {
        type: String,
        required: true,
        trim: true,
        maxlength: [20, 'Name cannot be more than 20 characters']
    }, // name
    av: String, // avatarUrl
    em: {
        type: String,
        required: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
        unique: true
    }, // email
    pa: {
        type: String,
        required: true
    } // password
})

UserSchema.pre('save', async function(next) {
    const salt = await bcrypr.genSalt(10);
    this.pa = await bcrypr.hash(this.pa, salt)
    next();
});

UserSchema.methods.createJWT = function() {
    return jwt.sign({ id: this._id, na: this.na }, process.env.SERCRET_KEY , { expiresIn: process.env.JWT_LIFETIME })
};

UserSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypr.compare(password, this.pa)
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema)