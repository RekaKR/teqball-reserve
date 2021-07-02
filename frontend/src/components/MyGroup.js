import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewEvent from './NewEvent'
import Event from './Event'


function MyGroup({ user, group, setNewRoleResponse, getToken }) {
    const [isAdmin, setIsAdmin] = useState()
    const [isNewEvent, setIsNewEvent] = useState(false)
    const [events, setEvents] = useState(false)
    const [participationResponse, setParticipationResponse] = useState()


    useEffect(() => {
        group.members.find(mem => mem.googleId === user.google).groupRole === "admin"
            ? setIsAdmin(true)
            : setIsAdmin(false)
    }, [])

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/events/${group._id}`, getToken())
            .then(res => setEvents(res.data))
    }, [isNewEvent, participationResponse])

    const changeRole = (e, googleId) => {
        const newRole = e.target.checked ? "admin" : "member"
        axios
            .post("http://localhost:5000/api/groups/update-member", {
                groupId: group._id,
                googleId: googleId,
                groupRole: newRole
            }, getToken())
            .then(res => setNewRoleResponse(res.data))
    }


// Norbi - user email küldése a naptárból 
    const quitGroup = () => {
        axios
        .post("http://localhost:5000/api/groups/quit", {
            groupId: group._id,
            googleId: user.google,
            email: user.email
        }, getToken())
        .then(res => setNewRoleResponse(res.data))
    }

    console.log(user)

    return (
        <div className="group">
            <p>{group.name}</p>
            <div>
                <p>Members:</p>
                {group.members.map((member, index) =>
                    <div key="index" className="member">
                        <img src={member.picture} alt="profile" className="profile-picture" />
                        <p>{member.name}</p>
                        <p>{member.groupRole}</p>
                        {
                            isAdmin &&
                            <div>
                                <label htmlFor="admin">Admin role: </label>
                                <input type="checkbox" name="admin" id="admin"
                                    defaultChecked={member.groupRole === "admin" ? true : false}
                                    onChange={(e) => changeRole(e, member.googleId)}
                                    disabled={group.creator === member.googleId 
                                        ? true : false}
                                />
                            </div>
                        }
                    </div>
                )}
                <button onClick={quitGroup}
                disabled={group.creator === user.google 
                    ? true : false}
                >Quit group</button>
            </div>
            <div>
                <p>Upcoming events: </p>
                {
                    isAdmin && <button onClick={() => setIsNewEvent(true)}>Create new event</button>
                }
                {
                    isNewEvent && <NewEvent
                        group={group} user={user}
                        setIsNewEvent={setIsNewEvent}
                        getToken={getToken}
                    />
                }
                <div>
                    {
                        events &&
                        events.filter(event => new Date(event.date) > new Date())
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(event =>
                            <Event event={event} user={user}
                                setParticipationResponse={setParticipationResponse}
                                getToken={getToken}
                            />
                        )
                    }
                </div>
            </div>
        </div>


    )
}

export default MyGroup
