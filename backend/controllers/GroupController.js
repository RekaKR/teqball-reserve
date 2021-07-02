const GroupService = require("../services/GroupService");
const AuthEntityService = require("../services/AuthEntityService");
const EventService = require("../services/EventService");
const { google } = require('googleapis');
// const oAuth2Client = new google.auth.OAuth2(
//     "645622545318-54bkra0rued7ajsn83sj3rdh0nik2fk9.apps.googleusercontent.com", "Kg3RyJ3wWM3Vj6qAhbEROwkF", 'http://localhost:3000/login'
// );

const oAuth2Client = new google.auth.OAuth2(
    "498850833112-nriqbtbfbke2mc1f90s4uvrbk0ehi9g9.apps.googleusercontent.com",
    "Y5PtJP9KtV-eUm5GtVecUaVw",
    'http://localhost:3000/login'
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
        console.log(calendarGroup)
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
// Norbi - kérdés, mást returnölünk
        // console.log(group)
        if (!group) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }

        const updatedUser = await AuthEntityService.removeGroup(googleId, groupId)
        
        const updateEvents = await EventService.removeMember(groupId, googleId)

// Norbi - a kilépő tag törlése a csapat naptárából

    const authToken = { refresh_token: group.groupForCalendar.refresh_token }
    oAuth2Client.setCredentials(authToken)

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

        await calendar.acl.delete({
            auth: oAuth2Client,
            calendarId: group.groupForCalendar.calendarId,
            ruleId: `user:${req.body.email}`
        });

// calendar mailjeinek ápdételése

    const attendees  = group.groupForCalendar.members.map(member => {
            return {email: member.email}
        })

        console.log(attendees)

    const events = await calendar.events.list({
            calendarId: group.groupForCalendar.calendarId,
            timeMin: (new Date()).toISOString()
        })

         const eventsArr = events.data.items

        const updatedAllEvents = async (eventsArr) => {

            await asyncForEach(eventsArr, async (event) => {
            await updateCalendarEvent(event)
            })

            console.log("az összes események frissítve");
        }

        const asyncForEach = async (eventsArr, callback) => {
            for (let index = 0; index < eventsArr.length; index++) {
                await callback(eventsArr[index], index, eventsArr);
            }
        }

        const updateCalendarEvent = (event) => {
            const newMails = {
                attendees: attendees
            };

            const updatedEvent = calendar.events.patch({
                auth: oAuth2Client,
                calendarId: group.groupForCalendar.calendarId,
                eventId: event.id,
                sendUpdates: "all",
                resource: newMails
            })

            console.log("esemény frissítve")

        }

        updatedAllEvents(eventsArr)

// --------------------------------------------------

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
// Norbi
        await joinGoogleGroup(group.refresh_token, data.email, group.calendarId, group)
        // await joinGoogleGroup(group.refresh_token, data.email, group.calendarId)

        res.json({ msg: "Group successfully updated!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function joinGoogleGroup(refresh_token, email, calendarId, group) {

// Norbi - tagok email-jei a frissítéshez
    const attendees  = group.members.map(member => {
        return {email: member.email}
    })
    attendees.push({email: email})
// -----------------------------------

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

// Norbi
        // calendar.acl.insert(
        await calendar.acl.insert(
            {
              auth: oAuth2Client,
              calendarId: calendarId,
              resource: newMember
            }
        )

// Norbi - események ápdéttelése
        const events = await calendar.events.list({
            calendarId: calendarId,
            timeMin: (new Date()).toISOString()
        })

        const eventsArr = events.data.items

        const updatedAllEvents = async (eventsArr) => {

            await asyncForEach(eventsArr, async (event) => {
            await updateCalendarEvent(event)
            })

            console.log("az összes események frissítve");
        }

        const asyncForEach = async (eventsArr, callback) => {
            for (let index = 0; index < eventsArr.length; index++) {
                await callback(eventsArr[index], index, eventsArr);
            }
        }

        const updateCalendarEvent = (event) => {
            const newMails = {
                attendees: attendees
            };

            const updatedEvent = calendar.events.patch({
                auth: oAuth2Client,
                calendarId: calendarId,
                eventId: event.id,
                sendUpdates: "all",
                resource: newMails
            })

            console.log("esemény frissítve")

        }

        updatedAllEvents(eventsArr)

// ---------------------------------------------------
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


