const user = require('../models/User')

class UserService {
    static async store(data) {
        try {
            const newUser = new user(data)
            newUser.save();
            return newUser;
        } catch(error) {
            console.error(error)
        }
    }
}

module.exports = UserService
