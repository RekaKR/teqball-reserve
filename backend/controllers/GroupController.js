const GroupService = require("../services/GroupService");
const AuthEntityService = require("../services/AuthEntityService");




async function getGroups(req, res) {
    try {
        const groups = await GroupService.getGroups()
        if (!groups) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        } 
        res.json(groups)
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

async function getMyGroups(req, res) {
    try {
        const googleId = req.body.google
        const groups = await AuthEntityService.getUserGroupes(googleId)
        if (groups.length === 0) {
            res.json([])
        } else {
            const myGroups = await GroupService.getMyGroups(groups)
            if (!myGroups) {
                res.status(400).json({
                    msg: 'Something went wrong!',
                })
            } 
            res.json(myGroups)
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }

}
async function getOtherGroups(req, res) {
    try {
        const googleId = req.body.google
        const myGroups = await AuthEntityService.getUserGroupes(googleId)
        const otherGroups = await GroupService.getOtherGroups(myGroups)
        if (!otherGroups) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        } 
        res.json(otherGroups)
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

async function insertGroup (req, res) {
    try {
        const newGroup = req.body
        const group = await GroupService.insertGroup(newGroup)
        if (!group) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        } 
        const googleId = group.members[0].googleId
        const groupId = group._id
        const updatedUser = await AuthEntityService.addNewGroup(googleId, groupId)
         
        res.json({msg: "New group successfully created!"})
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

async function updateMembers (req, res) {
    try {
        const data = req.body
        const group = await GroupService.updateMembers(data)
        if (!data) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        } 
        const updatedUser = await AuthEntityService.addNewGroup(data.google, data.groupId)
        res.json({msg: "Group successfully updated!"})
    } catch (error) {
        res.status(500).json({ error: error })
    }

}



exports.getGroups = getGroups;
exports.insertGroup = insertGroup;
exports.getMyGroups = getMyGroups;
exports.getOtherGroups = getOtherGroups;
exports.updateMembers = updateMembers;


