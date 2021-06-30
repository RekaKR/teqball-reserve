import React, { useState, useEffect } from 'react'
import axios from 'axios'
import GoogleMap from './GoogleMap'

function Event({ event, user, setParticipationResponse }) {
    const [isShowMore, setIsShowMore] = useState(false)
    const [showMap, setShowMap] = useState(false)


    const saveParticipation = (e) => {
        const participation = e.target.value
        axios
            .post("http://localhost:5000/api/events/update-participation", {
                eventId: event._id,
                participation: participation,
                member: {
                    googleId: user.google,
                    name: user.name,
                    picture: user.picture
                }
            })
            .then(res => setParticipationResponse(res.data))
    }

    const checkDefaultValue = (value) => {
        const actualUser = event.members.find(member => member.googleId === user.google)

        if (actualUser.participation === value) {
            return true
        } else {
            return false
        }
    }

    return (
        <div className="event" key={event._id}>
            <div className="basic-info">
                <p>{event.title}</p>
                <p>
                    {event.venue} 
                    <button onClick={() => setShowMap(true)}>Térkép</button>
                </p>
                {
                    showMap &&
                    <GoogleMap setShowMap={setShowMap} venue={event.venue}/>
                }
                <p>{event.date.slice(0, 10)}  {event.date.slice(11, 16)}</p>
                <div>
                    <label htmlFor="accept">Accept: </label>
                    <input type="radio" value="accepted"
                        name={event._id} id="accept"
                        onChange={saveParticipation}
                        defaultChecked={checkDefaultValue("accepted")} />
                    <label htmlFor="deny">Deny: </label>
                    <input type="radio" value="denied"
                        name={event._id} id="deny"
                        onChange={saveParticipation}
                        defaultChecked={checkDefaultValue("denied")} />
                    <label htmlFor="deny">I dont know: </label>
                    <input type="radio" value=""
                        name={event._id} id="deny"
                        onChange={saveParticipation}
                        defaultChecked={checkDefaultValue("")} />
                </div>
                <button
                    onClick={() => setIsShowMore(!isShowMore)}>
                    {isShowMore ? "Show less" : "Show more"}
                </button>
            </div>
            {
                isShowMore &&
                <div className="details">
                    <div>
                        <p>Description: </p>
                        <p>{event.description}</p>
                    </div>
                    <p>Accepted: </p>
                    {
                        event.members.filter(member => member.participation === "accepted")
                            .map(member =>
                                <div className="member">
                                    <img src={member.picture} alt="profile"
                                        className="profile-picture" />
                                    <p>{member.name}</p>
                                </div>
                            )
                    }
                    <p>Denied: </p>
                    {
                        event.members.filter(member => member.participation === "denied")
                            .map(member =>
                                <div className="member">
                                    <img src={member.picture} alt="profile"
                                        className="profile-picture" />
                                    <p>{member.name}</p>
                                </div>
                            )
                    }
                </div>
            }
        </div>
    )
}

export default Event
