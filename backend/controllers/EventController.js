const GroupService = require("../services/GroupService");
const EventService = require("../services/EventService");
const { google } = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(
    "645622545318-54bkra0rued7ajsn83sj3rdh0nik2fk9.apps.googleusercontent.com", "Kg3RyJ3wWM3Vj6qAhbEROwkF", 'http://localhost:3000/login'
);


async function getEventsByGroupId(req, res) {
    try {
        const groupId = req.params.groupId
        const events = await EventService.getEventsByGroupId(groupId)
        if (!events) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        res.json(events)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function getEventsByGoogleId(req, res) {
    console.log(req.params.googleId)
    try {
        const googleId = req.params.googleId
        const events = await EventService.getEventsByGoogleId(googleId)
        if (!events) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        res.json(events)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function insertEvent(req, res) {
    try {
        const event = req.body.event
        const newEvent = await EventService.insertEvent(event)
        if (!newEvent) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        } else {
            const updatedGroup = await GroupService.addNewEvent(event.groupId, newEvent._id)
            const resp = await createGoogleEvent(req.body, res)
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function createGoogleEvent(data, res) {

    oAuth2Client.setCredentials({ refresh_token: data.refresh_token });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });


    const { title, description, date, end, members } = data.event
    const attendees = members.map(member => {
        return { email: member.email }
    })

    const startDate = date + ":00+02:00"
    const endDate = end + ":00+02:00"

    const newEvent = {
        summary: title,
        description: description,
        start: {
            dateTime: startDate,
        },
        end: {
            dateTime: endDate,
        },
        attendees: attendees,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 60 },
                { method: 'popup', minutes: 30 },
            ],
        }
    }

    //   start: {
    //     dateTime: '2021-06-29T20:00:00+01:00',
    //   },

   calendar.events.insert({
        auth: oAuth2Client,
        sendUpdates: "all",
        calendarId: 'primary',
        resource: newEvent,
    }, function (err, event) {

        //console.log(event.data.id);

        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        res.json({ msg: event.data.htmlLink  })

    });
}

async function updateParticipation(req, res) {
    try {
        const updatedEvent = await EventService.updateParticipation(req.body)

        if (!updatedEvent) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        res.json({ msg: "Event was successfully updated!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}


exports.insertEvent = insertEvent;
exports.getEventsByGroupId = getEventsByGroupId;
exports.getEventsByGoogleId = getEventsByGoogleId;
exports.updateParticipation = updateParticipation;



