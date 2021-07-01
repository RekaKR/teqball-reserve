import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewGroup from './NewGroup'
import MyGroup from './MyGroup'

function MyGroups({ user, getToken }) {
    const [isNewGroup, setIsNewGroup] = useState(false)
    const [newRoleResponse, setNewRoleResponse] = useState()
    const [groups, setGroups] = useState()

    useEffect(() => {
        axios
            .post("http://localhost:5000/api/groups/mygroups", {google: user.google}, getToken())
            .then(resp => setGroups(resp.data))
    }, [isNewGroup, newRoleResponse])

    return (
        <div>
            <div>
                <button onClick={() => setIsNewGroup(true)}>
                    Create new group
                </button>
                {
                    isNewGroup && <NewGroup setIsNewGroup={setIsNewGroup} user={user} getToken={getToken}/>
                }
            </div>
            <div className="groups">
                {
                    groups && groups.reverse().map((group, i) =>
                        <MyGroup user={user} group={group}
                        setNewRoleResponse={setNewRoleResponse}
                        getToken={getToken}/>
                    )
                }
            </div>
        </div>
    )
}

export default MyGroups
