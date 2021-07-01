const GroupService = require("../services/GroupService");
const AuthEntityService = require("../services/AuthEntityService");
const EventService = require("../services/EventService");
const { google } = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(
    "645622545318-54bkra0rued7ajsn83sj3rdh0nik2fk9.apps.googleusercontent.com", "Kg3RyJ3wWM3Vj6qAhbEROwkF", 'http://localhost:3000/login'
);


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

async function insertGroup(req, res) {
    try {
        const newGroup = req.body
        const refresh_token = newGroup.refresh_token

        const calendarId = await createGoogleGroup(newGroup.name, refresh_token)

        const groupToInsert = { ...newGroup, calendarId }
        const group = await GroupService.insertGroup(groupToInsert)
        if (!group) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        const googleId = group.members[0].googleId
        const groupId = group._id
        const updatedUser = await AuthEntityService.addNewGroup(googleId, groupId)

        res.json({ msg: "New group successfully created!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function createGoogleGroup(name, refresh_token) {

    oAuth2Client.setCredentials({ refresh_token: refresh_token })
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    const newCalendar = {
        summary: name
    }

    try {
        const calendarGroup = await calendar.calendars.insert(
            {
                auth: oAuth2Client,
                resource: newCalendar
            }
        )
        const calendarId = calendarGroup.data.id
        return calendarId

    } catch (error) {
        console.log(error)
    }
}

async function quitGroup(req, res) {
    try {
        const groupId = req.body.groupId
        const googleId = req.body.googleId

        const group = await GroupService.deleteGroupMember(groupId, googleId)
        if (!group) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }

        const updatedUser = await AuthEntityService.removeGroup(googleId, groupId)

        const updateEvents = await EventService.removeMember(groupId, googleId)

        res.json({ msg: "Update was successful." })
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

async function insertMember(req, res) {
    try {
        const data = req.body
        const group = await GroupService.insertMember(data)

        if (!data) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        const updatedUser = await AuthEntityService.addNewGroup(data.google, data.groupId)

        const newMember = {
            googleId: data.google,
            name: data.name,
            email: data.email,
            picture: data.picture,
            participation: ""
        }
        await EventService.insertMember(data.groupId, newMember)

        await joinGoogleGroup(group.refresh_token, data.email, group.calendarId)

        res.json({ msg: "Group successfully updated!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function joinGoogleGroup(refresh_token, email, calendarId) {
    const authToken = { refresh_token: refresh_token }
    oAuth2Client.setCredentials(authToken)

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

    const newMember = {
        role: "writer",
        scope: {
            type: "user",
            value: email
        }
    }
    try {
        calendar.acl.insert(
            {
              auth: oAuth2Client,
              calendarId: calendarId,
              resource: newMember
            }
        )
        return true

    } catch (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
    }
}

async function updateMemberRole(req, res) {
    try {
        const { groupId, googleId, groupRole } = req.body
        await GroupService.updateMemberRole(groupId, googleId, groupRole)
        res.json({ msg: "Group successfully updated!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }

}



exports.getGroups = getGroups;
exports.insertGroup = insertGroup;
exports.getMyGroups = getMyGroups;
exports.getOtherGroups = getOtherGroups;
exports.quitGroup = quitGroup;
exports.insertMember = insertMember;
exports.updateMemberRole = updateMemberRole;


