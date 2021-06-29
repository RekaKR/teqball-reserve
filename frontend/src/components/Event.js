import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Event({ event, user, setParticipationResponse }) {
    const [isShowMore, setIsShowMore] = useState(false)

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
        <div className="event">
            <div className="basic-info">
                <p>{event.title}</p>
                <p>{event.venue}</p>
                <p>{event.date.slice(0, 10)}  {event.date.slice(11, 16)}</p>
                <div>
                    <label htmlFor="accept">Accept: </label>
                    <input type="radio" value="accepted"
                        name="participation" id="accept"
                        onChange={saveParticipation} 
                        defaultChecked={checkDefaultValue("accepted")}/>
                    <label htmlFor="deny">Deny: </label>
                    <input type="radio" value="denied"
                        name="participation" id="deny"
                        onChange={saveParticipation} 
                        defaultChecked={checkDefaultValue("denied")}/>
                    <label htmlFor="deny">I dont know: </label>
                    <input type="radio" value=""
                        name="participation" id="deny"
                        onChange={saveParticipation} 
                        defaultChecked={checkDefaultValue("")}/>
                </div>
                <button
                    onClick={() => setIsShowMore(!isShowMore)}>
                    {isShowMore ? "Show less" : "Show more"}
                </button>
            </div>
            {
                isShowMore &&
                <div className="details">
                    <p>{event.description}</p>
                    <p>Accepted: </p>
                    {
                        event.members.filter(member => member.participation === "accepted")
                            .map(member =>
                                <>
                                    <img src={member.picture} alt="profile" />
                                    <p>{member.name}</p>
                                </>
                            )
                    }
                    <p>Denied: </p>
                    {
                        event.members.filter(member => member.participation === "denied")
                            .map(member =>
                                <>
                                    <img src={member.picture} alt="profile" />
                                    <p>{member.name}</p>
                                </>
                            )
                    }
                </div>
            }
        </div>
    )
}

export default Event
