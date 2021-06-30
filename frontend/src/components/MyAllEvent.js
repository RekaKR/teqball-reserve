import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Event from './Event'

function MyAllEvent({ user }) {
    const [events, setEvents] = useState()
    const [participationResponse, setParticipationResponse] = useState()

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/events/byId/${user.google}`)
            .then(res => setEvents(res.data))
    }, [participationResponse])

    return (
        <div>
            <p>My events</p>
            {
                events &&
                events.sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((event, i) =>
                    <Event event={event} user={user} 
                    setParticipationResponse={setParticipationResponse}/>
                )
            }
        </div>
    )
}

export default MyAllEvent
