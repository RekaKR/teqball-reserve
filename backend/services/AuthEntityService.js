const AuthEntity = require("../models/AuthEntity");


async function  getUser (query) {
    try {
        const user = AuthEntity.findOne(query)
        return  user
    } catch (error) {
        console.log(`Could not fetch users ${error}`)
    }
}

async function  getUsers () {
    try {
        const users = AuthEntity.find()
        return  users
    } catch (error) {
        console.log(`Could not fetch users ${error}`)
    }
}


async function  insertUser (user) {
    try {
        const newUser = new AuthEntity(user)
        const res = await newUser.save();
        return  res
    } catch (error) {
        console.log(`Could not fetch user ${error}`)
    }
}




exports.getUser = getUser;
exports.getUsers = getUsers;
exports.insertUser = insertUser;
