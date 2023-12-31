const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, 'secret')
        //payload data in user authen
        req.userData = decode;
        next();
    }
    catch (error){
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}