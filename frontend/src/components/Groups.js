import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Groups({ user }) {
    const [groups, setGroups] = useState()
    const [response, setResponse] = useState()

    useEffect(() => {

        axios
            .post("http://localhost:5000/api/groups/othergroups", { google: user.google })
            .then(resp => setGroups(resp.data))
    }, [response])

    const updateMembers = (groupId) => {
        axios
        .post("http://localhost:5000/api/groups/insert-member", {...user, groupId: groupId})
        .then(res => setResponse(res.data))
    }

    return (
        <div>
            Groups
            <div>
                {
                    groups && groups.map((group, i) =>
                        <div key={i} className="group">
                            <p>{group.name}</p>
                            <p>Members:</p>
                            <div>
                                {group.members.map((member, index) =>
                                    <div key="index" className="member">
                                        <img src={member.picture} alt="profile" className="profile-picture" />
                                        <p>{member.name}</p>
                                        <p>{member.groupRole}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <button onClick={() => updateMembers(group._id)}>Join</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Groups
