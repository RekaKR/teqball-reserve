const Event = require("../models/Event");


async function  getEventsByGroupId (groupId) {
    try {
        const events = Event.find({groupId: groupId})
        return  events
    } catch (error) {
        console.log(`Could not fetch event ${error}`)
    }
}

async function  getEventsByGoogleId (googleId) {
    console.log(googleId)
    try {
        const events = Event.find({'members.googleId': googleId})
        return  events
    } catch (error) {
        console.log(`Could not fetch event ${error}`)
    }
}

async function  insertEvent (event) {
    try {
        const newEvent = new Event(event)
        const res = await newEvent.save();
        return  res
    } catch (error) {
        console.log(`Could not fetch event ${error}`)
    }
}

async function  updateParticipation (event) {
    try {
        const updatedEvent = await Event.updateOne(
            {$and: [{_id: event.eventId}, {'members.googleId': event.member.googleId}]}, 
            {$set: {'members.$.participation': event.participation }}
          )
        return  updatedEvent
    } catch (error) {
        console.log(`Could not fetch event ${error}`)
    }
}

async function  insertMember (groupId, member) {
    try {
        const newMember = await Event.updateOne(
            {groupId: groupId}, 
            {$push: {members: member }}
          )
        return  newMember
    } catch (error) {
        console.log(`Could not fetch event ${error}`)
    }
}




exports.getEventsByGroupId = getEventsByGroupId;
exports.getEventsByGoogleId = getEventsByGoogleId;
exports.insertEvent = insertEvent;
exports.updateParticipation = updateParticipation;
exports.insertMember = insertMember;

