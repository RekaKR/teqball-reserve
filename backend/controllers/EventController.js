const GroupService = require("../services/GroupService");
const EventService = require("../services/EventService");
;


async function getEventsByGroupId(req, res) {
    try {
        const groupId = req.params.groupId
        const  events = await EventService.getEventsByGroupId(groupId)
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
        const  events = await EventService.getEventsByGoogleId(googleId)
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
        const event = req.body
        const  newEvent = await EventService.insertEvent(event)
        if (!newEvent) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        } else {
            const updatedGroup = await GroupService.addNewEvent( event.groupId, newEvent._id)
            res.json({ msg: "Event successfully created!" })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function updateParticipation(req, res) {
    try {
        const  updatedEvent = await EventService.updateParticipation(req.body)

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



