const UserDAO = require('../daos/UserDAO');

class UserRepository {
    async getUserById(userId) {
        return await UserDAO.getUserById(userId);
    }

    async getUserByEmail(email) {
        return await UserDAO.getUserByEmail(email);
    }

    async createUser(userData) {
        return await UserDAO.createUser(userData);
    }

    async updateUser(userId, updateData) {
        return await UserDAO.updateUser(userId, updateData);
    }
}

module.exports = new UserRepository();
