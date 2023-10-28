//import { v4 as uuidv4 } from 'uuid';

class User{
    constructor(id, name, userImage, email, password){
        this.id = id,
        this.name = name,
        this.userImage = userImage,
        this.email = email,
        this.password = password
    }
}

module.exports = User