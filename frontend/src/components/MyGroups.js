import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewGroup from './NewGroup'

function MyGroups({ user }) {
    const [isNewGroup, setIsNewGroup] = useState(false)
    const [groups, setGroups] = useState()

    useEffect(() => {
        axios
            .post("http://localhost:5000/api/groups/mygroups", {google: user.google})
            .then(resp => setGroups(resp.data))
    }, [isNewGroup])

    return (
        <div>
            <div>
                <button onClick={() => setIsNewGroup(true)}>
                    Create new group
                </button>
                {
                    isNewGroup && <NewGroup setIsNewGroup={setIsNewGroup} user={user} />
                }
            </div>
            <div>
                
                {
                    groups && groups.map((group, i) =>
                        <div key={i} className="group">
                            <p>{group.name}</p>
                            <p>Members:</p>
                            <div>
                                {group.members.map((member, index) => 
                                    <div key="index" className="member">
                                        <img src={member.picture} alt="profile" className="profile-picture"/>
                                        <p>{member.name}</p>
                                        <p>{member.groupRole}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default MyGroups
