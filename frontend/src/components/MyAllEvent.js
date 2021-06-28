import React, { useState, useEffect } from 'react'
import axios from 'axios'

function MyAllEvent ({user}) {
    const [events, setEvents] = useState()
    console.log(`http://localhost:5000/api/events/${user.google}`)

    useEffect(() => {
        console.log("fut")
        axios
            .get(`http://localhost:5000/api/events/byId/${user.google}`)
            .then(res => setEvents(res.data))
    }, [])

    return (
        <div>
            <p>Hello</p>
            {
                events &&
                events.map((event, i) => 
                    <div>
                        {event.title}
                    </div>
                )
            }
        </div>
    )
}

export default MyAllEvent
