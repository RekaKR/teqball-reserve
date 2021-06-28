import React, { useState, useEffect } from 'react'
import axios from 'axios'

function NewEvent ({group, setIsNewEvent}) {
    const [event, setEvent] = useState({})

    const handleChange = (e) => {
        setEvent({...event, [e.target.name]: e.target.value})
    }

    const createNewEvent = () => {
        const members = group.members.map(member => {
           return {...member, participation: ""}
        })
        const newEvent = {...event, groupId: group._id, members}
        axios
            .post("http://localhost:5000/api/events/insert", newEvent)
            .then(res => setIsNewEvent(false))
    }

    return (
        <div>
            <div>
                <label htmlFor="title">Title: </label>
                <input type="text" id="title" name="title"
                onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="date">Date: </label>
                <input type="datetime-local" name="date" id="date" 
                onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="venue">Venue: </label>
                <input type="text" id="venue" name="venue"
                onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="description">Description: </label>
                <textarea id="description" name="description"
                onChange={handleChange}/>
            </div>
            <div>
                <button onClick={createNewEvent}>Create</button>
            </div>
        </div>
    )
}

export default NewEvent
