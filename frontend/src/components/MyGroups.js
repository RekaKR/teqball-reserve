import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewGroup from './NewGroup'
import MyGroup from './MyGroup'

function MyGroups({ user }) {
    const [isNewGroup, setIsNewGroup] = useState(false)
    const [newRoleResponse, setNewRoleResponse] = useState()
    const [groups, setGroups] = useState()

    useEffect(() => {
        axios
            .post("http://localhost:5000/api/groups/mygroups", {google: user.google})
            .then(resp => setGroups(resp.data))
    }, [isNewGroup, newRoleResponse])

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
                        <MyGroup user={user} group={group}
                        setNewRoleResponse={setNewRoleResponse}/>
                    )
                }
            </div>
        </div>
    )
}

export default MyGroups
