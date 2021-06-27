const Group = require("../models/Group");


async function  getGroups () {
    try {
        const groups = Group.find()
        return  groups
    } catch (error) {
        console.log(`Could not fetch groups ${error}`)
    }
}

async function  getMyGroups (groups) {
    try {
        const query = {
            $or: []
        }
        groups.forEach(group => query.$or.push({_id: group}))
        const mygroups = await Group.find(query)
        return  mygroups
    } catch (error) {
        console.log(`Could not fetch groups ${error}`)
    }
}
async function  getOtherGroups (groups) {
    try {
        if (groups.length === 0) {
            const otherGroups = await Group.find()
            return  otherGroups
        } else {
            const query = {
                $and: []
            }
            groups.forEach(group => query.$and.push({_id: {$ne: group} }))
            const otherGroups = await Group.find(query)
            return  otherGroups
        }
    } catch (error) {
        console.log(`Could not fetch groups ${error}`)
    }
}


async function  insertGroup (group) {
    try {
        const newGroup = new Group(group)
        const res = await newGroup.save();
        return  res
    } catch (error) {
        console.log(`Could not fetch group ${error}`)
    }
}

async function  updateMembers (data) {
    try {
        const group = await Group.findOneAndUpdate(
            { _id: data.groupId }, 
            { $push: { members: {
                googleId: data.google,
                name: data.name,
                groupRole: "member",
                picture: data.picture
            } } },
          )
        return  group
    } catch (error) {
        console.log(`Could not fetch group ${error}`)
    }
}


exports.getGroups = getGroups;
exports.insertGroup = insertGroup;
exports.getMyGroups = getMyGroups;
exports.getOtherGroups = getOtherGroups;
exports.updateMembers = updateMembers;
