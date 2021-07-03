const GroupService = require("../services/GroupService");
const EventService = require("../services/EventService");
// const { google } = require('googleapis');
// const oAuth2Client = new google.auth.OAuth2(
//     "645622545318-54bkra0rued7ajsn83sj3rdh0nik2fk9.apps.googleusercontent.com", "Kg3RyJ3wWM3Vj6qAhbEROwkF", 'http://localhost:3000/login'
// );
        
const CalendarService = require("../services/CalendarService");


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
        const calendarEvent = await CalendarService.createGoogleEvent(req.body, updatedGroup.calendarId)
        
        console.log(newEvent)
        
        const updatedEvent = await EventService.updateEvent(newEvent._id, calendarEvent.data.id)  
        
        // console.log(event.groupId)
        // console.log(calendarEvent.data.id)
    
        res.json({ msg: "successfully created the event"  })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function updateParticipation(req, res) {
    try {
        const updatedEvent = await EventService.updateParticipation(req.body)

        const group = await GroupService.getGroupById(req.body.groupId)
        const event = await EventService.getEventsByGroupId(req.body.groupId)
        // console.log(event[0].members)
        // console.log(req.body)
        // console.log(group.calendarId)
        await CalendarService.updateResponseStatus(req.body, group.calendarId, event[0].members, group.refresh_token )

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



