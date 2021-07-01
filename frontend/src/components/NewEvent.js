import React, { useState, useEffect } from 'react'
import axios from 'axios'

function NewEvent ({group, user, setIsNewEvent, getToken}) {
    const [event, setEvent] = useState({})

    const handleChange = (e) => {
        setEvent({...event, [e.target.name]: e.target.value})
    }

    const createNewEvent = () => {
        const members = group.members.map(member => {
           return {...member, participation: ""}
        })

        const newEvent = {...event, groupId: group._id, members}

        const data = {
            refresh_token: user.refresh_token,
            event: newEvent
        }
        axios
            .post("http://localhost:5000/api/events/insert", data, getToken())
            .then(res => { 
                setIsNewEvent(false)
            })
    }

    return (
        <div>
            <div>
                <label htmlFor="title">Title: </label>
                <input type="text" id="title" name="title"
                onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="date">Start: </label>
                <input type="datetime-local" name="date" id="date" 
                onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="end">End: </label>
                <input type="datetime-local" name="end" id="end" 
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
